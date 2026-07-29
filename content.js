/**
 * YT Dislike Restorer - Final Production Build
 * Exact parity with official Return YouTube Dislike formatting and padding.
 */

// 1. Pixel-Perfect Number Formatter (Matches YouTube's native >10K rounding logic)
function formatNumber(num) {
    if (num === null || num === undefined) return '';
    
    // Millions (e.g., 1.5M, 1M)
    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'M';
    }
    // YouTube natively drops decimals for numbers over 10K (e.g., 18,900 -> 19K)
    if (num >= 10000) {
        return Math.round(num / 1000) + 'K';
    }
    // Thousands (e.g., 1.5K, 1K)
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'K';
    }
    // Hundreds
    return num.toString();
}

// 2. State Engine 
const dislikeCache = {};
const pendingFetches = new Set();

async function getDislikes(videoId) {
    if (dislikeCache[videoId] !== undefined) return dislikeCache[videoId];
    if (pendingFetches.has(videoId)) return null; 

    pendingFetches.add(videoId);
    try {
        const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
        if (response.ok) {
            const data = await response.json();
            if (data && typeof data.dislikes === 'number') {
                dislikeCache[videoId] = data.dislikes;
                return data.dislikes;
            }
        }
    } catch (err) {
        console.error("YT Dislike Restorer: API Fetch Error", err);
    } finally {
        pendingFetches.delete(videoId);
    }
    return null;
}

function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    let videoId = urlParams.get('v');
    
    if (!videoId) {
        const pathSegments = window.location.pathname.split('/');
        if (pathSegments[1] === 'live' || pathSegments[1] === 'shorts') {
            videoId = pathSegments[2];
        }
    }
    return videoId;
}

// 3. The Core UI Injector
async function updateDislikeUI() {
    const videoId = getVideoId();
    if (!videoId) return;

    let count = dislikeCache[videoId];
    if (count === undefined) {
        count = await getDislikes(videoId);
    }
    
    if (count === null || count === undefined) return;
    const formattedCount = formatNumber(count);

    // Ghost DOM Bypass
    let activeContainer = document.querySelector('ytd-watch-metadata');
    if (!activeContainer && window.location.pathname.includes('/shorts/')) {
        activeContainer = document.querySelector('ytd-reel-video-renderer[is-active]');
    }
    if (!activeContainer) return;

    const likeButton = activeContainer.querySelector('#segmented-like-button button, like-button-view-model button, #like-button button');
    const dislikeButton = activeContainer.querySelector('#segmented-dislike-button button, dislike-button-view-model button, #dislike-button button');
    
    if (!likeButton || !dislikeButton) return;

    let textContainer = dislikeButton.querySelector('.custom-dislike-text');

    if (!textContainer) {
        // Clone Strategy to inherit typography
        const likeTextContainer = likeButton.querySelector('div[class*="cbox"]') 
                               || (likeButton.querySelector('span[role="text"]') ? likeButton.querySelector('span[role="text"]').parentNode : null) 
                               || likeButton.querySelector('.yt-spec-button-shape-next__button-text-content');
        
        if (likeTextContainer) {
            textContainer = likeTextContainer.cloneNode(true);
            textContainer.className = likeTextContainer.className + ' custom-dislike-text';
            dislikeButton.appendChild(textContainer);
        } else {
            textContainer = document.createElement('div');
            textContainer.className = 'yt-spec-button-shape-next__button-text-content custom-dislike-text';
            dislikeButton.appendChild(textContainer);
        }
    }

    // Force YouTube to treat the dislike button exactly like the Like button layout
    dislikeButton.classList.remove('yt-spec-button-shape-next--icon-button');
    dislikeButton.classList.add('yt-spec-button-shape-next--icon-text-button');
    
    // --- THE FINAL PIXEL-PERFECT OVERRIDE ---
    // 1. Wipe out any native or lingering margin hacks on the inner SVG icon
    const iconContainer = dislikeButton.querySelector('.yt-spec-button-shape-next__icon');
    if (iconContainer) {
        iconContainer.style.margin = '0';
    }

    // 2. Explicitly force the exact paddings to match the Like button
    dislikeButton.style.width = 'auto';
    dislikeButton.style.paddingLeft = '11px';  // Creates the gap between the divider line and the thumb
    dislikeButton.style.paddingRight = '16px'; // Creates the gap between the text and the right edge
    textContainer.style.marginLeft = '6px';    // Creates the gap between the thumb and the text

    if (textContainer.textContent !== formattedCount) {
        textContainer.textContent = formattedCount;
    }
}

// 4. Polling & SPA Navigations
setInterval(updateDislikeUI, 300);
document.addEventListener('yt-navigate-finish', updateDislikeUI);
window.addEventListener('popstate', updateDislikeUI);