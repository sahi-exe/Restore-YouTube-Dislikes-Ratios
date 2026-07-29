# YouTube Dislike Restorer 👎

A lightweight, pixel-perfect Chrome Extension that restores the dislike counter on YouTube. 

Unlike basic injection scripts, this extension is engineered to seamlessly integrate with YouTube's modern Single Page Application (SPA) architecture and dynamic segmented-button Flexbox layouts.

## ✨ Technical Features

* **SPA "Ghost DOM" Bypass:** YouTube's navigation engine (`yt-navigate-finish`) recycles DOM elements and hides previous videos rather than destroying them. This extension intelligently scopes its queries to the `ytd-watch-metadata` active container, ensuring the UI only updates for the currently visible video without requiring page refreshes.
* **Pixel-Perfect Native Cloning:** Instead of fighting YouTube's stylesheet with clunky inline CSS, this script clones the native `cbox` text nodes from the active "Like" button. This forces the Dislike button to perfectly inherit YouTube's proprietary typography, 6px icon margins, and padding.
* **API Rate-Limit Protection:** Implements a robust `Set()` and memory-cache system to prevent redundant asynchronous calls to the Return YouTube Dislike API, safeguarding against IP bans during heavy navigation.
* **Native Number Formatting:** Accurately mimics YouTube's proprietary rounding logic (e.g., dynamically rounding `18,900` to `19K` and stripping trailing decimals) for seamless UI integration.

## 🚀 Installation (Developer Mode)

1. Clone this repository: `git clone https://github.com/yourusername/YT-Dislike-Restorer.git`
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the directory containing the cloned repository.
5. Open YouTube—no refreshes required!

## 🛠️ Tech Stack
* **JavaScript (ES6+)**: Asynchronous API fetching, DOM manipulation, and mutation observation.
* **Return YouTube Dislike API**: Backend data interpolation.
* **Manifest V3**: Compliant with the latest Chrome Web Store security protocols.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.