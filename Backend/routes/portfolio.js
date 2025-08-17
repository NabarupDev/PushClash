const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const { generatePortfolioRoastWithGemini } = require('../services/ai-service');

// Portfolio analysis for a GitHub user
router.post('/portfolio', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // For now, just return a simple message
    res.json({
      message: "we are now live",
      user: {
        username: username
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to generate portfolio analysis",
      message: error.message
    });
  }
});

// New endpoint to get website favicon
router.post('/portfolio/icon', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    //console.log(`🔍 Looking for favicon at: ${url}`);
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Extract favicon information
    const faviconData = await page.evaluate(() => {
      // Check for favicon in various locations
      const icons = [];
      
      // Check link tags for favicon
      const linkIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
      linkIcons.forEach(icon => {
        icons.push({
          href: icon.href,
          rel: icon.rel,
          sizes: icon.sizes ? icon.sizes.value : null,
          type: icon.type || null
        });
      });
      
      // If no icons found, check for default /favicon.ico
      if (icons.length === 0) {
        const defaultFavicon = new URL('/favicon.ico', window.location.origin).href;
        icons.push({
          href: defaultFavicon,
          rel: 'shortcut icon',
          sizes: null,
          type: 'image/x-icon'
        });
      }
      
      return icons;
    });
    
    await browser.close();
    
    // Return the favicon data
    res.json({
      success: true,
      url: url,
      icons: faviconData,
      primaryIcon: faviconData.length > 0 ? faviconData[0].href : null
    });
    
  } catch (error) {
    console.error('❌ Error fetching favicon:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get website icon",
      message: error.message
    });
  }
});

// Add new endpoint to roast a portfolio
router.post('/portfolio/roast', async (req, res) => {
  try {
    const { url, scrapeData } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    if (!scrapeData) {
      return res.status(400).json({ error: "Scrape data is required" });
    }
    
    //console.log(`🔥 Generating portfolio roast for: ${url}`);
    
    // Generate a roast using Gemini
    const roast = await generatePortfolioRoastWithGemini(url, scrapeData);
    
    res.json({
      success: true,
      url: url,
      roast: roast
    });
    
  } catch (error) {
    console.error('❌ Error generating portfolio roast:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to generate portfolio roast",
      message: error.message
    });
  }
});

// Web scraping endpoint
router.post('/scrape', async (req, res) => {
  // Logging incoming request
  //console.log('📥 Incoming POST request to scrape endpoint:');
  //console.log('- Headers:', JSON.stringify(req.headers, null, 2));
  //console.log('- Body:', JSON.stringify(req.body, null, 2));
  //console.log('- Time:', new Date().toISOString());
  
  try {
    // Get URL from request body or use default
    const urlToScrape = req.body.url || 'https://nabaruproy.me/';
    //console.log(`🔍 Scraping URL: ${urlToScrape}`);
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROMIUM_PATH || puppeteer.executablePath() // Use custom path if provided
    });
        
    const page = await browser.newPage();
    
    // Collect console logs and JS errors
    const consoleMessages = [];
    const jsErrors = [];
    
    page.on('console', message => {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
        location: message.location()
      });
    });
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Start measuring performance
    const startTime = Date.now();
    
    // Navigate to the URL from request
    await page.goto(urlToScrape, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Calculate page load time
    const loadTime = Date.now() - startTime;
    
    // Run performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries.length > 0) {
        const navigationTiming = perfEntries[0];
        return {
          dnsLookup: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
          tcpConnection: navigationTiming.connectEnd - navigationTiming.connectStart,
          serverResponse: navigationTiming.responseStart - navigationTiming.requestStart,
          domLoading: navigationTiming.domInteractive - navigationTiming.responseEnd,
          domComplete: navigationTiming.domComplete - navigationTiming.domInteractive,
          totalLoadTime: navigationTiming.loadEventEnd - navigationTiming.startTime
        };
      }
      return null;
    });
    
    // Check meta tags for SEO and accessibility
    const metaTags = await page.evaluate(() => {
      const tags = Array.from(document.querySelectorAll('meta'));
      return tags.map(tag => {
        const attributes = {};
        Array.from(tag.attributes).forEach(attr => {
          attributes[attr.name] = attr.value;
        });
        return attributes;
      });
    });
    
    // Check for missing important meta tags
    const missingMetaTags = await page.evaluate(() => {
      const important = [
        { name: 'title', selector: 'title' },
        { name: 'description', selector: 'meta[name="description"]' },
        { name: 'viewport', selector: 'meta[name="viewport"]' },
        { name: 'canonical', selector: 'link[rel="canonical"]' },
        { name: 'og:title', selector: 'meta[property="og:title"]' },
        { name: 'og:description', selector: 'meta[property="og:description"]' }
      ];
      
      return important.filter(tag => !document.querySelector(tag.selector)).map(tag => tag.name);
    });
    
    // Check for broken links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim() || '[No Text]',
        href: a.href,
        isInternal: a.href.includes(window.location.hostname)
      }));
    });
    
    // Checking for unresponsive design by simulating different viewports
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1366, height: 768, name: 'desktop' }
    ];
    
    const responsiveCheck = [];
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.reload({ waitUntil: 'networkidle2' });
      
      // Check if any elements extend beyond viewport
      const overflowingElements = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const elements = Array.from(document.querySelectorAll('*'));
        return elements
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.right > viewportWidth + 5; // 5px tolerance
          })
          .map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            width: el.getBoundingClientRect().width
          }));
      });
      
      responsiveCheck.push({
        viewport: viewport.name,
        width: viewport.width,
        overflowingElements: overflowingElements.slice(0, 10) // Limit to 10 elements
      });
    }
    
    // Image size and format check
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        alt: img.alt || '[No alt text]',
        format: img.src.split('.').pop().split('?')[0].toLowerCase()
      }));
    });
    
    // Form behavior check
    const forms = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('form')).map(form => {
        const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          required: input.required,
          hasLabel: !!document.querySelector(`label[for="${input.id}"]`)
        }));
        
        return {
          action: form.action,
          method: form.method,
          id: form.id,
          inputs
        };
      });
    });
    
    // Check for unused or bloated CSS/JS
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(r => r.name.endsWith('.css') || r.name.endsWith('.js'))
        .map(r => ({
          url: r.name,
          type: r.name.endsWith('.css') ? 'css' : 'js',
          size: r.transferSize,
          duration: r.duration
        }));
    });
    
    // Accessibility check
    const accessibilityViolations = await page.evaluate(() => {
      const violations = [];
      
      // Check for images without alt text
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'))
        .map(img => img.src);
      
      if (imagesWithoutAlt.length > 0) {
        violations.push({
          type: 'missing-alt-text',
          elements: imagesWithoutAlt.slice(0, 10) // Limit to 10
        });
      }
      
      // Check for heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
      
      if (headingLevels.filter(level => level === 1).length !== 1) {
        violations.push({
          type: 'multiple-h1-tags',
          count: headingLevels.filter(level => level === 1).length
        });
      }
      
      // Check for proper heading hierarchy
      for (let i = 0; i < headingLevels.length - 1; i++) {
        if (headingLevels[i+1] > headingLevels[i] + 1) {
          violations.push({
            type: 'skipped-heading-level',
            from: headingLevels[i],
            to: headingLevels[i+1]
          });
          break;
        }
      }
      
      // Check for poor color contrast (basic check)
      const lowContrastElements = [];
      const textElements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label'));
      
      for (const el of textElements.slice(0, 20)) { // Limit check to 20 elements
        const style = window.getComputedStyle(el);
        const color = style.color;
        const background = style.backgroundColor;
        
        // Very basic contrast check
        if (color === 'rgba(0, 0, 0, 0)' || background === 'rgba(0, 0, 0, 0)') {
          continue; // Skip transparent elements
        }
        
        if ((color === 'rgb(255, 255, 255)' && background === 'rgb(255, 255, 255)') || 
            (color === 'rgb(0, 0, 0)' && background === 'rgb(0, 0, 0)')) {
          lowContrastElements.push({
            text: el.innerText.substring(0, 50),
            foreground: color,
            background: background
          });
        }
      }
      
      if (lowContrastElements.length > 0) {
        violations.push({
          type: 'potential-low-contrast',
          elements: lowContrastElements
        });
      }
      
      return violations;
    });
    
    // GitHub/project link check
    const githubLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="github.com"]'));
      return links.map(link => ({
        text: link.innerText,
        href: link.href
      }));
    });
    
    // Get scraped data
    const scraped = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText);
      
      const mainContent = document.querySelector('main') ? document.querySelector('main').innerText : '';
      
      return {
        title: document.title,
        url: window.location.href,
        headings,
        mainContent: mainContent.substring(0, 500) + '...' // Truncate for readability
      };
    });
    
    await browser.close();
    
    // Build the response object
    const responseData = {
      success: true,
      message: 'Data scraped successfully',
      data: {
        basic: scraped,
        metrics: {
          loadTime,
          performanceMetrics
        },
        issues: {
          consoleMessages,
          jsErrors,
          missingMetaTags,
          accessibilityViolations
        },
        seo: {
          metaTags,
          pageTitle: scraped.title
        },
        links: {
          total: links.length,
          internal: links.filter(l => l.isInternal).length,
          external: links.filter(l => !l.isInternal).length,
          sample: links.slice(0, 10) // Limit to 10 links
        },
        responsiveCheck,
        images: {
          total: images.length,
          withoutAlt: images.filter(img => img.alt === '[No alt text]').length,
          largeImages: images.filter(img => (img.naturalWidth * img.naturalHeight) > 1000000).length,
          sample: images.slice(0, 10) // Limit to 10 images
        },
        forms,
        resourceSizes,
        githubLinks
      }
    };
    
    // Log response data (with summarized content to avoid cluttering the console)
    //console.log('📤 Sending response from scrape endpoint:');
    //console.log('- Success:', responseData.success);
    //console.log('- Time taken:', loadTime + 'ms');
    //console.log('- Page title:', scraped.title);
    //console.log('- Console messages:', consoleMessages.length);
    //console.log('- JS errors:', jsErrors.length);
    //console.log('- Links found:', links.length);
    //console.log('- Images found:', images.length);
    //console.log('- Forms found:', forms.length);
    //console.log('- Response size:', Buffer.byteLength(JSON.stringify(responseData)) + ' bytes');
    
    // Send the response
    res.json(responseData);
  } catch (error) {
    console.error('❌ Error scraping website:', error);
    
    // Log the error response
    const errorResponse = {
      success: false,
      message: 'Error scraping website',
      error: error.message
    };
    
    //console.log('📤 Sending error response:');
    //console.log(errorResponse);
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;
