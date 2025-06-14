const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const logger = require('../utils/logger'); // Assuming a logger utility will be created

function findChromePath() {
  const platform = os.platform();
  logger.info(`Detecting Chrome path for platform: ${platform}`);

  // Check for CHROME_PATH environment variable first
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    logger.info(`Chrome found via CHROME_PATH environment variable: ${process.env.CHROME_PATH}`);
    return process.env.CHROME_PATH;
  }

  // Définir les chemins potentiels par plateforme
  const paths = {
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe') : null,
      process.env.PROGRAMFILES ? path.join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe') : null,
      process.env['ProgramFiles(x86)'] ? path.join(process.env['ProgramFiles(x86)'], 'Google', 'Chrome', 'Application', 'chrome.exe') : null
    ].filter(Boolean),
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      path.join(os.homedir(), 'Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome')
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium'
    ]
  };

  // Vérifier les chemins selon la plateforme
  const platformPaths = paths[platform] || [];
  for (const chromePath of platformPaths) {
    try {
      if (fs.existsSync(chromePath)) {
        logger.info(`Chrome found at: ${chromePath}`);
        return chromePath;
      }
    } catch (err) {
      logger.warn(`Error checking path ${chromePath}: ${err.message}`);
    }
  }

  // Code pour la détection automatique selon la plateforme...
  // On peut réutiliser le code existant de server.js ici
  try {
    // On macOS
    if (platform === 'darwin') {
      logger.info('Attempting macOS automatic detection...');
      const output = execSync('mdfind "kMDItemDisplayName == \'Google Chrome\' && kMDItemKind == Application"').toString().trim();
      const installations = output.split('\n').filter(Boolean);
      if (installations.length > 0) {
        const detectedPath = path.join(installations[0], '/Contents/MacOS/Google Chrome');
         if (fs.existsSync(detectedPath)) {
            logger.info(`Chrome found via mdfind: ${detectedPath}`);
            return detectedPath;
         }
      }
    }

    // On Windows, use the registry
    if (platform === 'win32') {
      logger.info('Attempting Windows registry detection...');
      try {
        const registryOutput = execSync(
          'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve',
          { encoding: 'utf-8', windowsHide: true }
        ).toString();
        const match = registryOutput.match(/REG_SZ\s+(.*)$/i);
        if (match && match[1]) {
          const chromePath = match[1].trim();
           if (fs.existsSync(chromePath)) {
              logger.info(`Chrome found via registry: ${chromePath}`);
              return chromePath;
           }
        }
      } catch (regErr) {
         logger.warn(`Windows registry query failed: ${regErr.message}`);
      }

       // Fallback for Windows: check common user-specific paths
       if (process.env.USERPROFILE) {
           const userProfilePaths = [
               path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe'),
               path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'Google', 'Chrome', 'Application', 'chrome.exe'),
           ];
           for (const chromePath of userProfilePaths) {
               if (fs.existsSync(chromePath)) {
                   logger.info(`Chrome found in user profile path: ${chromePath}`);
                   return chromePath;
               }
           }
       }
    }

     // On Linux, try 'which' command
     if (platform === 'linux') {
        logger.info('Attempting Linux "which" detection...');
        try {
            const chromePath = execSync('which google-chrome || which chromium-browser || which chromium', { encoding: 'utf-8' }).toString().trim();
            if (chromePath && fs.existsSync(chromePath)) {
                logger.info(`Chrome found via which: ${chromePath}`);
                return chromePath;
            }
        } catch (whichErr) {
            logger.warn(`Linux "which" command failed: ${whichErr.message}`);
        }
     }

  } catch (err) {
    logger.warn(`Automatic Chrome detection failed: ${err.message}`);
  }


  logger.error('Chrome executable not found. Please install Google Chrome or set the CHROME_PATH environment variable.');
  return null;
}

function getPuppeteerOptions() {
  // Defer Chrome path finding until actually needed
  let chromePath = null;

  const options = {
    headless: process.env.NODE_ENV === 'production' || process.env.PUPPETEER_HEADLESS === 'true', // Use headless in production or when explicitly set
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-pings',
      '--use-fake-ui-for-media-stream',
      '--autoplay-policy=no-user-gesture-required'
    ],
  };

  // Configuration spéciale pour Docker pour éviter les conflits de profil
  if (process.env.DOCKER_ENV === 'true') {
    options.args.push(
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-web-security',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees',
      '--remote-debugging-port=0',
      '--disable-session-crashed-bubble',
      '--disable-infobars',
      '--no-crash-upload',
      '--disable-crash-reporter',
      '--single-process',
      '--force-device-scale-factor=1',
      '--disable-features=VizDisplayCompositor'
    );
    
    // Utiliser un répertoire temporaire unique pour éviter les conflits
    const tmpUserDataDir = `/tmp/chrome-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    options.userDataDir = tmpUserDataDir;
    logger.info(`Docker environment: using temporary user data directory: ${tmpUserDataDir}`);
  }

  // Find Chrome path only when needed and not in Docker
  if (process.env.DOCKER_ENV !== 'true') {
    chromePath = findChromePath();
    
    // Add executablePath if found
    if (chromePath) {
      options.executablePath = chromePath;
    } else {
       logger.warn('Chrome executable path not found. Puppeteer might download a compatible Chromium binary.');
    }
  } else {
    // In Docker, use the detected Chrome path
    const dockerChromePath = findChromePath();
    if (dockerChromePath) {
      options.executablePath = dockerChromePath;
      logger.info(`Docker environment: using detected Chrome at ${dockerChromePath}`);
    } else {
      // Fallback to common Docker Chrome paths
      const fallbackPaths = ['/usr/bin/google-chrome', '/usr/bin/chromium-browser'];
      for (const fallbackPath of fallbackPaths) {
        if (fs.existsSync(fallbackPath)) {
          options.executablePath = fallbackPath;
          logger.info(`Docker environment: using fallback Chrome at ${fallbackPath}`);
          break;
        }
      }
    }
  }

  // Configurations spécifiques à Windows et Docker
  if (os.platform() === 'win32') {
    const userDataDir = process.env.WHATSAPP_USER_DATA_DIR ||
                         path.join(os.homedir(), 'AppData', 'Local', 'WhatsAppAutomation', 'UserData');

    try {
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
        logger.info(`Created Windows user data directory: ${userDataDir}`);
      }

      options.userDataDir = userDataDir;
      logger.info(`Using Windows user data directory: ${options.userDataDir}`);
    } catch (err) {
      logger.error(`Failed to create Windows user data directory ${userDataDir}: ${err.message}`);
    }
  }

  // Note: Configuration Docker déjà gérée ci-dessus

  return options;
}

module.exports = {
  getPuppeteerOptions,
  getSessionDirectory: () => path.join(process.cwd(), 'session-whatsapp-api')
};
