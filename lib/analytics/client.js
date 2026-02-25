import { PostHog } from 'posthog-node';

const client = new PostHog(
  process.env.POSTHOG_API_KEY || 'phc_s5dpMW7DvBDzwFpo0dWrj59N2iFi6aj59yn4bW8gmP8',
  {
    host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
);

export const shutdownAnalytics = async () => {
  await client.shutdown();
};

export default client;
