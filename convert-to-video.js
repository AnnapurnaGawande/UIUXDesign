#!/usr/bin/env node

/**
 * HTML to Video Converter
 * Converts the love_message_video.html animation to MP4 format
 * 
 * Requirements:
 * - Node.js installed
 * - npm install puppeteer puppeteer-screen-recorder
 * 
 * Usage: node convert-to-video.js
 */

const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');

async function convertHtmlToVideo() {
  console.log('🎬 Starting HTML to Video conversion...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport size (WhatsApp optimal: 1080x1920 for vertical, 1920x1080 for horizontal)
  await page.setViewport({
    width: 1080,
    height: 1920,
    deviceScaleFactor: 1
  });
  
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: false,
    fps: 30,
    videoFrame: {
      width: 1080,
      height: 1920
    },
    aspectRatio: '9:16', // WhatsApp story format
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'love_message_video.html');
  await page.goto(`file://${htmlPath}`, { waitForTimeout: 1000 });
  
  console.log('📹 Starting recording...');
  await recorder.start('./love_message_video.mp4');
  
  // Click the play button to start animation
  await page.click('#playButton');
  
  // Wait for animation to complete (28 seconds + 2 seconds buffer)
  await page.waitForTimeout(30000);
  
  console.log('⏹️  Stopping recording...');
  await recorder.stop();
  
  await browser.close();
  
  console.log('✅ Video created successfully: love_message_video.mp4');
  console.log('📱 You can now share this video on WhatsApp!');
}

convertHtmlToVideo().catch(console.error);
