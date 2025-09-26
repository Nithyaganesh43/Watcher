require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { sendEmail, generateServerDownAlert } = require('./email');
// ----- Schema -----
const serverSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    url: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['online', 'offline', 'checking'],
      default: 'checking',
    },
    responseTime: { type: Number, default: 0 },
    lastCheck: { type: Date, default: Date.now },
    consecutiveFailures: { type: Number, default: 0 },
    alertEnabled: { type: Boolean, default: true },
    alertSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);

// ----- DB Connection -----
const connectToDb = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URL, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
};

// ----- Pinger -----
const pingServer = async (url, timeout = 15000) => {
  const startTime = Date.now();
  try {
    const response = await axios({
      method: 'GET',
      url,
      timeout,
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
      headers: { 'User-Agent': 'Watchtower-Monitor/1.0' },
    });
    return {
      success: true,
      responseTime: Date.now() - startTime,
      statusCode: response.status,
      errorMessage: null,
    };
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      statusCode: error.response?.status || null,
      errorMessage:
        error.code === 'ECONNABORTED'
          ? 'Request timeout'
          : (error.message || 'Unknown error').substring(0, 500),
    };
  }
};

// ----- Batch Processing -----
const processServerBatch = async (servers) => {
  await Promise.allSettled(
    servers.map(async (server) => {
      const pingResult = await pingServer(server.url);
      let consecutiveFailures = server.consecutiveFailures;
      let alertSent = server.alertSent;
      let shouldSendAlert = false;

      if (pingResult.success) {
        consecutiveFailures = 0;
        if (alertSent) alertSent = false;
      } else {
        consecutiveFailures++;
        if (consecutiveFailures >= 3 && server.alertEnabled && !alertSent) {
          shouldSendAlert = true;
          alertSent = true;
        }
      }

      await Server.findByIdAndUpdate(server._id, {
        status: pingResult.success ? 'online' : 'offline',
        responseTime: pingResult.responseTime,
        lastCheck: new Date(),
        consecutiveFailures,
        alertSent,
      });

      if (shouldSendAlert) {
        try {
          const alertHtml = generateServerDownAlert(
            server,
            pingResult.errorMessage
          );
          await sendEmail(
            server.userEmail,
            `🚨 Server Down Alert: ${server.url}`,
            alertHtml
          );
          console.log(`Alert sent for ${server.url}`);
        } catch (e) {
          console.error(`Email failed for ${server.url}:`, e);
          await Server.findByIdAndUpdate(server._id, { alertSent: false });
        }
      }
    })
  );
};

// ----- Lambda Handler -----
exports.handler = async () => {
  await connectToDb();

  const totalServers = await Server.countDocuments();
  if (!totalServers) {
    console.log('No servers to monitor');
    return;
  }

  console.log(`Monitoring ${totalServers} servers...`);
  const batchSize = 20;

  for (let skip = 0; skip < totalServers; skip += batchSize) {
    const batch = await Server.find({}).skip(skip).limit(batchSize).lean();
    await processServerBatch(batch);
    if (skip + batchSize < totalServers)
      await new Promise((r) => setTimeout(r, 500));
  }

  console.log('Monitoring cycle completed');
};
if (require.main === module) {
  (async () => {
    try {
      await exports.handler();
      process.exit(0); // exit after finishing
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
