/**
 * Restore YouTube Dislikes & Ratios - Final Stable Build
 * Featuring Native Text Cloning, Dual Button Tooltips, and ASO Loop
 */

// ==========================================
// 1. Number Formatter & Helper Functions
// ==========================================
function formatNumber(num) {
    if (num === null || num === undefined) return '';
    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'M';
    }
    if (num >= 10000) {
        return Math.round(num / 1000) + 'K';
    }
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'K';
    }
    return num.toString();
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

// ==========================================
// 2. Data Engine (Votes & Ratio Calculations)
// ==========================================
const dislikeCache = {};
const pendingFetches = new Set();

async function getVoteData(videoId) {
    if (dislikeCache[videoId] !== undefined) return dislikeCache[videoId];
    if (pendingFetches.has(videoId)) return null; 

    pendingFetches.add(videoId);
    try {
        const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
        if (response.ok) {
            const data = await response.json();
            if (data && typeof data.dislikes === 'number') {
                const likes = data.likes || 0;
                const dislikes = data.dislikes || 0;
                const total = likes + dislikes;
                const likeRatio = total > 0 ? (likes / total) * 100 : 100;
                
                dislikeCache[videoId] = {
                    dislikes: dislikes,
                    likes: likes,
                    likeRatio: Math.round(likeRatio)
                };
                return dislikeCache[videoId];
            }
        }
    } catch (err) {
        console.error("Restore YouTube Dislikes: API Error", err);
    } finally {
        pendingFetches.delete(videoId);
    }
    return null;
}

// ==========================================
// 3. Core Text UI & Tooltip Injector
// ==========================================
async function updateDislikeUI() {
    const videoId = getVideoId();
    if (!videoId) return;

    let voteData = dislikeCache[videoId];
    if (!voteData) {
        voteData = await getVoteData(videoId);
    }
    
    if (!voteData) return;

    const formattedDislikes = formatNumber(voteData.dislikes);

    // Locate active button containers
    let activeContainer = document.querySelector('ytd-watch-metadata');
    if (!activeContainer && window.location.pathname.includes('/shorts/')) {
        activeContainer = document.querySelector('ytd-reel-video-renderer[is-active]');
    }
    if (!activeContainer) return;

    const likeButton = activeContainer.querySelector('#segmented-like-button button, like-button-view-model button, #like-button button');
    const dislikeButton = activeContainer.querySelector('#segmented-dislike-button button, dislike-button-view-model button, #dislike-button button');
    
    if (!likeButton || !dislikeButton) return;

    // -- INJECT TEXT --
    let textContainer = dislikeButton.querySelector('.custom-dislike-text');

    if (!textContainer) {
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

    // Apply native layout overrides
    dislikeButton.classList.remove('yt-spec-button-shape-next--icon-button');
    dislikeButton.classList.add('yt-spec-button-shape-next--icon-text-button');
    
    const iconContainer = dislikeButton.querySelector('.yt-spec-button-shape-next__icon');
    if (iconContainer) iconContainer.style.margin = '0';

    dislikeButton.style.width = 'auto';
    dislikeButton.style.paddingLeft = '11px';
    dislikeButton.style.paddingRight = '16px';
    textContainer.style.marginLeft = '6px';

    if (textContainer.textContent !== formattedDislikes) {
        textContainer.textContent = formattedDislikes;
        trackUsageAndPromptReview(); // ASO counter trigger
    }

    // -- INJECT RATIO TOOLTIP --
    // Applied to both Like & Dislike buttons for seamless interaction
    const tooltipText = `${voteData.likeRatio}% Rating (${formatNumber(voteData.likes)} Likes / ${formattedDislikes} Dislikes)`;
    likeButton.setAttribute('title', tooltipText);
    dislikeButton.setAttribute('title', tooltipText);
}

// ==========================================
// 4. App Store Optimization (ASO) Review Prompt
// ==========================================
const REVIEW_THRESHOLD = 50; 
const EXTENSION_ID = chrome.runtime.id; 

function trackUsageAndPromptReview() {
    chrome.storage.local.get(['restoreCount', 'hasReviewed'], (data) => {
        if (data.hasReviewed) return;

        let count = (data.restoreCount || 0) + 1;
        chrome.storage.local.set({ restoreCount: count });

        if (count === REVIEW_THRESHOLD) {
            injectReviewToast();
        }
    });
}

function injectReviewToast() {
    if (document.getElementById('yt-dislike-review-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'yt-dislike-review-toast';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        background-color: #212121;
        color: #f1f1f1;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        font-family: "Roboto", Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 16px;
        border: 1px solid #383838;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    toast.innerHTML = `
        <div>
            <strong style="display: block; font-size: 15px; margin-bottom: 4px;">Loving the restored dislikes & ratios?</strong>
            <span style="color: #aaaaaa;">Take 5 seconds to rate the extension!</span>
        </div>
        <div style="display: flex; gap: 8px;">
            <button id="yt-toast-dismiss" style="background: transparent; color: #aaaaaa; border: none; padding: 8px 12px; cursor: pointer; font-weight: 500; border-radius: 18px;">Not Now</button>
            <button id="yt-toast-rate" style="background: #3ea6ff; color: #0f0f0f; border: none; padding: 8px 16px; cursor: pointer; font-weight: 500; border-radius: 18px;">Rate 5 Stars</button>
        </div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    document.getElementById('yt-toast-rate').addEventListener('click', () => {
        chrome.storage.local.set({ hasReviewed: true }); 
        window.open(`https://chrome.google.com/webstore/detail/${EXTENSION_ID}/reviews`, '_blank');
        toast.remove();
    });

    document.getElementById('yt-toast-dismiss').addEventListener('click', () => {
        chrome.storage.local.set({ restoreCount: 0 }); 
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    });
}

// ==========================================
// 5. Polling & SPA Event Listeners
// ==========================================
setInterval(updateDislikeUI, 300);
document.addEventListener('yt-navigate-finish', updateDislikeUI);
window.addEventListener('popstate', updateDislikeUI);