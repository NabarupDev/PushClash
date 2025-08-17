// Helper function to clean README text
function cleanReadmeText(text) {
  if (!text) return null;
  
  // Remove Markdown links [text](url) but keep the text
  let cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove images ![alt](url)
  cleanText = cleanText.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  
  // Remove HTML tags
  cleanText = cleanText.replace(/<[^>]*>/g, '');
  
  // Remove code blocks
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`[^`]*`/g, '');
  
  // Remove multiple spaces and newlines
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  return cleanText;
}

function formatUrl(url) {
  if (!url) return 'Not provided';
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Extract the domain name without subdomains like 'www'
    const domainParts = hostname.split('.');
    let domain = hostname;
    
    if (domainParts.length >= 2) {
      // If it's a common format like www.example.com
      if (domainParts[0] === 'www') {
        domain = domainParts[1]; // Take the main domain name
      } else {
        domain = domainParts[0]; // Take first part as domain
      }
    }
    
    return domain.charAt(0).toUpperCase() + domain.slice(1); // Capitalize first letter
  } catch (e) {
    // If it's not a valid URL, just return it as is
    return url;
  }
}

module.exports = {
  cleanReadmeText,
  formatUrl
};
