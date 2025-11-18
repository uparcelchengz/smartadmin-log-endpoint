import log from './colors-log.js';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Configuration
const WEBHOOK_URL = 'https://smartadmin-log-endpoint.vercel.app/api/webhook';
const WEBHOOK_SECRET = 'smartadmin';

// Activity log file path
const activityLogDir = path.join(app.getPath('documents'), 'smartadmin', 'logs');
const activityLogFile = path.join(activityLogDir, 'activity-log.json');

export let thisUser = null;

/**
 * Get public IP address and its location information
 * 获取公网 IP 地址及其位置信息
 * @returns {Promise<Object|null>} Object containing IP and location data, or null if failed
 */
async function getPublicIPWithLocation() {
    try {
        // Get public IP
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
            timeout: 5000
        });
        const ipData = await ipResponse.json();
        const publicIP = ipData.ip;

        if (!publicIP) {
            log.error('Failed to fetch public IP');
            return null;
        }

        // Get location for the public IP
        const locationEndpoint = `http://ip-api.com/json/${publicIP}?fields=status,message,city,regionName,country,timezone,isp,proxy,hosting`;
        const locationResponse = await fetch(locationEndpoint, {
            timeout: 5000
        });

        if (!locationResponse.ok) {
            throw new Error(`IP location lookup failed with status ${locationResponse.status}`);
        }

        const locationData = await locationResponse.json();
        
        if (locationData.status === 'fail') {
            log.warning(`IP location lookup failed for ${publicIP}: ${locationData.message}`);
            return {
                ip: publicIP,
                location: null
            };
        }

        return {
            ip: publicIP,
            status: locationData.status,
            message: locationData.message || null,
            city: locationData.city,
            region: locationData.regionName,
            country: locationData.country,
            timezone: locationData.timezone,
            isp: locationData.isp,
            proxy: locationData.proxy,
            hosting: locationData.hosting,
            hostname: os.hostname(),
            appVersion: app.getVersion()
        };
    } catch (error) {
        log.error('Error fetching public IP with location:', error.message);
        return null;
    }
}

/**
 * Initialize webhook with user data
 * 使用用户数据初始化 webhook
 * @param {Object} userDataObj - User data object
 * @param {boolean} sendWebhook - Whether to send the initialization webhook
 */
async function initializeWebhook(userDataObj, sendWebhook=false){
    thisUser = await getPublicIPWithLocation();
    thisUser = { ...thisUser, ...userDataObj };
    if (sendWebhook){
        await sendActivityToWebhook({
            event: 'App Started / User Logged In',
            ip: thisUser.ip,
            timezone: thisUser.timezone,
            message: thisUser.email ? `App Initialize Event Triggered for User [${thisUser.name}(${thisUser.email})] with IP ${thisUser.ip}(${thisUser.timezone})` : `App Initialize Event Triggered with IP ${thisUser.ip}(${thisUser.timezone}) [No User Logged In]`,
        })
    }
}

async function webhookSimpleSend(event, message, attachData=false, saveLocal=false){
    let activityData = {
        event,
        message
    }

    if (attachData){
        activityData = { 
            ...activityData,
            hostname: thisUser.hostname,
            ip: thisUser.ip,
            timezone: thisUser.timezone,
            email: thisUser.email || null,
            name: thisUser.name || null
        };
    }
    await sendActivityToWebhook(activityData);
    if (saveLocal){
        saveActivityLocally(activityData);
    }
}

/**
 * Ensure the activity log directory exists
 * 确保活动日志目录存在
 */
function ensureLogDir() {
    try {
        if (!fs.existsSync(activityLogDir)) {
            fs.mkdirSync(activityLogDir, { recursive: true });
            log.info(`Created activity log directory at: ${activityLogDir}`);
        }
    } catch (error) {
        log.error('Error ensuring log directory exists:', error);
    }
}

/**
 * Send activity to webhook
 * 发送活动到 webhook
 * @param {Object} activityData - The activity data to send
 * @returns {Promise<Object>} Response object with success status
 */
async function sendActivityToWebhook(activityData) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': WEBHOOK_SECRET
            },
            body: JSON.stringify(activityData)
        });

        if (!response.ok) {
            throw new Error(`Webhook request failed with status ${response.status}`);
        }

        const result = await response.json();
        log.info('Activity sent to webhook successfully');
        return { success: true, result };

    } catch (error) {
        log.error('Error sending activity to webhook:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Save activity locally as backup
 * 本地保存活动作为备份
 * @param {Object} activityData - The activity data to save
 */
function saveActivityLocally(activityData) {
    try {
        ensureLogDir();

        let activities = [];
        
        // Read existing log file if it exists
        if (fs.existsSync(activityLogFile)) {
            const content = fs.readFileSync(activityLogFile, 'utf-8');
            activities = JSON.parse(content);
        }

        // Add new activity with timestamp
        activities.push({
            timestamp: new Date().toISOString(),
            ...activityData
        });

        // Keep only last 1000 activities to prevent file from growing too large
        if (activities.length > 1000) {
            activities = activities.slice(-1000);
        }

        // Write back to file
        fs.writeFileSync(activityLogFile, JSON.stringify(activities, null, 2), 'utf-8');
        log.info('Activity saved locally');

    } catch (error) {
        log.error('Error saving activity locally:', error.message);
    }
}

/** 
 * Log activity by sending to webhook and saving locally
 * 记录活动，通过发送到 webhook 并本地保存
 * @param {Object} activityData - The activity data to log
 */
async function activityLog(activityData, isDetail = false) {
    let enrichedActivityData = { ...activityData };
    
    if (isDetail) {
        const ipInfo = await getPublicIPWithLocation();
        // add all ipInfo fields to activityData
        enrichedActivityData = { ...enrichedActivityData, ...ipInfo };
    }

    // Send to webhook
    await sendActivityToWebhook(enrichedActivityData);
    // Save locally as backup
    saveActivityLocally(enrichedActivityData);
}

export {
    ensureLogDir,
    sendActivityToWebhook,
    saveActivityLocally,
    getPublicIPWithLocation as getIPInfo,
    activityLog,
    initializeWebhook,
    webhookSimpleSend
}