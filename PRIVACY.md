# Privacy Policy for YT Dislike Restorer

**Last Updated:** July 2026

YT Dislike Restorer ("the Extension") respects your privacy. This policy outlines how the Extension handles data.

### Data Collection
The Extension **does not** collect, store, or transmit any Personally Identifiable Information (PII), browsing history, or analytics to the developer. 

### Third-Party APIs
To function, the Extension reads the video ID of the currently active YouTube tab and sends an anonymous, read-only GET request to the open-source [Return YouTube Dislike API](https://returnyoutubedislike.com/) to retrieve the statistical vote count. No user tokens, account information, or identifiable metadata are sent with this request.

### Local Storage
The Extension utilizes a temporary, local in-memory cache strictly to prevent redundant API calls during your active browsing session. This cache is cleared entirely when the browser tab is closed. 

### Contact
If you have any questions regarding this privacy policy or the open-source codebase, please open an issue on the project's GitHub repository.