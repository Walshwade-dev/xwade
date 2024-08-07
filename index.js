import { tweetsData } from "/data.js";
import { v4 as uuidV4 } from "https://jspm.dev/uuid";

const tweetInput = document.querySelector('#tweet-input');


document.addEventListener('click', (e) => {
    if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);

    }else if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like);

    }else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);

    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick();
    }
})


function handleTweetBtnClick(){
    let tweetInput = document.querySelector('#tweet-input').value.trim();

    if(tweetInput){
        let tweetInputObj = {
                handle: `@new-user-alert`,
                profilePic: `assets/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidV4(),
        }

        tweetsData.unshift(tweetInputObj);

        render();
        tweetInput.value = "";
    }

}

function handleReplyClick(replyId) {
    tweetsData.filter((tweet) => {
        if(tweet.replies.length > 0 && tweet.uuid === replyId){
            document.getElementById(replyId).classList.toggle("hidden");
        }
    })
}


function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter((tweet) => (tweet.uuid === tweetId))[0];


    if(targetTweetObj.isLiked){
        targetTweetObj.likes--;
    } else {
        targetTweetObj.likes++;
    }

    targetTweetObj.isLiked = !targetTweetObj.isLiked;

   render();
}

function handleRetweetClick(tweetId){
    const targetRetweetObj = tweetsData.filter((tweet)=> (tweet.uuid === tweetId))[0];

    if (targetRetweetObj.isRetweeted){
        targetRetweetObj.retweets--
    } else {
        targetRetweetObj.retweets++
    }

    targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;

    render()
}


function getFeedHtml() {
    let feedHtml = ''
    tweetsData.forEach(tweet => {


        const likedClass = tweet.isLiked ? 'liked' : 'text-[#999]';
        const retweetClass = tweet.isRetweeted ? 'retweeted' : 'text-[#999]';

        let repliesHtml = "";

        if(tweet.replies.length > 0){
            tweet.replies.forEach((reply) => {
                return repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                    </div>
                `
            })
        }

        feedHtml += `
            <div class="tweet flex gap-4 my-2 border-t-[1px] border-gray-300 py-4">
                <div>
                    <img src="${tweet.profilePic}" class="profile-pic">
                </div>
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details mt-2">
                        <span class="tweet-detail flex items-center gap-2 cursor-pointer" >
                            <i class="fa-sharp fa-regular fa-comment-dots text-[#999]" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>

                        <span class="tweet-detail flex items-center gap-2 cursor-pointer" >
                            <i class="fa-sharp fa-solid fa-heart ${likedClass}" data-like="${tweet.uuid}" ></i>
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
        `
    });

    return feedHtml;
}


function render() {
    document.getElementById("feed").innerHTML = getFeedHtml();
}

render();