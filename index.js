import { tweetsData } from "/data.js";
import { v4 as uuidV4 } from "https://jspm.dev/uuid";

const tweetInput = document.querySelector('#tweet-input');

window.addEventListener('load', () => {
    loadFromLocalStorage();
    render(); // Ensure the feed is rendered with any stored data
});

document.addEventListener('click', (e) => {
    const tweetElement = e.target.closest('.tweet');
    if (tweetElement) {
        const tweetId = tweetElement.dataset.tweetId;
        if (e.target.dataset.reply) {
            handleReplyClick(e.target.dataset.reply);
        } else if (e.target.dataset.like) {
            handleLikeClick(e.target.dataset.like);
        } else if (e.target.dataset.retweet) {
            handleRetweetClick(e.target.dataset.retweet);
        } else if (e.target.id === 'tweet-btn') {
            handleTweetBtnClick();
        } else if (tweetId) {
            handleTweetClick(tweetId);
        }
    }
});

function handleTweetBtnClick() {
    const tweetText = tweetInput.value.trim();

    if (tweetText) {
        const tweetInputObj = {
            handle: '@new-user-alert',
            profilePic: 'assets/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetText,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidV4(),
        };

        tweetsData.unshift(tweetInputObj);
        saveToLocalStorage(); // Save the updated tweetsData
        render();
        tweetInput.value = "";
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

function loadFromLocalStorage() {
    const storedData = localStorage.getItem('tweetsData');
    if (storedData) {
        // Update tweetsData with loaded data
        const parsedData = JSON.parse(storedData);
        tweetsData.length = 0; // Clear the existing array
        tweetsData.push(...parsedData); // Add the loaded data
    }
}

function handleReplyClick(replyId) {
    const tweet = tweetsData.find(tweet => tweet.uuid === replyId);
    if (tweet) {
        const repliesElement = document.getElementById(replyId);
        if (repliesElement) {
            repliesElement.classList.toggle("hidden");
        }
    }
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    if (targetTweetObj) {
        targetTweetObj.isLiked = !targetTweetObj.isLiked;
        targetTweetObj.likes += targetTweetObj.isLiked ? 1 : -1;
        saveToLocalStorage(); // Save the updated tweetsData
        render();
    }
}

function handleRetweetClick(tweetId) {
    const targetRetweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    if (targetRetweetObj) {
        targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;
        targetRetweetObj.retweets += targetRetweetObj.isRetweeted ? 1 : -1;
        saveToLocalStorage(); // Save the updated tweetsData
        render();
    }
}

function handleTweetClick(tweetId) {
    const tweetElement = document.querySelector(`.tweet[data-tweet-id="${tweetId}"]`);
    if (tweetElement) {
        // Highlight the selected tweet
        document.querySelectorAll('.tweet').forEach(el => el.classList.remove('selected'));
        tweetElement.classList.add('selected');

        // Prompt user for confirmation
        if (confirm("Do you want to delete this tweet?")) {
            deleteTweet(tweetId);
        }
    }
}

function deleteTweet(tweetId) {
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1); // Remove tweet from array
        saveToLocalStorage(); // Update local storage
        render(); // Re-render the feed
    }
}

function getFeedHtml() {
    return tweetsData.map(tweet => {
        const likedClass = tweet.isLiked ? 'liked' : 'text-[#999]';
        const retweetClass = tweet.isRetweeted ? 'retweeted' : 'text-[#999]';

        const repliesHtml = tweet.replies.map(reply => `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="tweet flex gap-4 my-2 border-t-[1px] border-gray-300 py-4" data-tweet-id="${tweet.uuid}">
                <div>
                    <img src="${tweet.profilePic}" class="profile-pic">
                </div>
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details mt-2">
                        <span class="tweet-detail flex items-center gap-2 cursor-pointer">
                            <i class="fa-sharp fa-regular fa-comment-dots text-[#999]" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>

                        <span class="tweet-detail flex items-center gap-2 cursor-pointer">
                            <i class="fa-sharp fa-solid fa-heart ${likedClass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>

                        <span class="tweet-detail flex items-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>

                    <div id="${tweet.uuid}" class="hidden">
                        ${repliesHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function render() {
    document.getElementById("feed").innerHTML = getFeedHtml();
}
