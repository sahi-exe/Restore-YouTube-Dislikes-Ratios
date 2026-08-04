# Restore YouTube Dislikes & Ratios 📊

A lightweight, privacy-first Chrome Extension that restores YouTube dislike counts, precise rating ratios, and creator metrics directly into the native UI.

## 🚀 Features

* **Pixel-Perfect Native UI:** Clones YouTube's exact DOM structure and SVG padding for a seamless, undetectable integration of the dislike count.
* **Smart Ratio Tooltips:** Hover over the Like or Dislike buttons to instantly reveal the video's true community rating percentage and raw like/dislike counts.
* **Manifest V3 Compliant:** Built using the latest Chrome extension architecture for maximum performance, security, and minimal memory footprint.
* **Zero-Tracking Privacy:** No analytics, no telemetry, and no background scripts draining CPU. 

## 🛠️ Architecture & Technologies

* **Vanilla JavaScript:** Zero heavy dependencies, hacky CSS overrides, or framework bloat for lightning-fast execution.
* **DOM Mutation & State Engine:** Efficient polling, caching mechanisms, and event listeners (`yt-navigate-finish`, `popstate`) designed specifically to handle YouTube's Single Page Application (SPA) navigations without breaking layouts.
* **Data Integration:** Hooks into the community-driven `returnyoutubedislikeapi.com` endpoint for accurate historical and extrapolated video metrics.

## 📦 Installation

### From the Chrome Web Store
*(Link Coming Soon)*

### Manual Developer Installation
1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the extension directory.
5. Open any YouTube video to see the real-time metrics in action!

## 📜 License
This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.