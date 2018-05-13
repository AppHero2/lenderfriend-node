var config = {
    apiKey: "AIzaSyC9_eGrZufcFVy0jS9Ytv-7RYvduZur91Q",
    authDomain: "tube-dude.firebaseapp.com",
    databaseURL: "https://tube-dude.firebaseio.com",
    projectId: "tube-dude",
    storageBucket: "tube-dude.appspot.com",
    messagingSenderId: "67302929067"
};
firebase.initializeApp(config);

function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady');
    isReadyYoutube = true;
}

var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);    

    var isReadyYoutube = false;
    var videoPlayer = null;   
    var currentVideo = null;
    var unique_code = null;
    var sender_email = null;
    var isClickedSend = false;

    $(document).ready(function(){
        
        const settings = {timestampsInSnapshots: true};
        var db = firebase.firestore();
        db.settings(settings);
        db.collection('VideoONE').doc('bF2LwpKJ3qQvflLAWIKU').onSnapshot(function(doc) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source, " data: ", doc.data());
            currentVideo = doc.data();

            initYoutubePlayer('tube_frame', currentVideo.tube_id);
            
        });

    });

    function onSend(){
        isClickedSend = true
        $('#exampleModal').modal('hide');
    }

    function initYoutubePlayer(divId, videoId) {

        if (!isReadyYoutube) {
            setTimeout(function() { initYoutubePlayer(divId, videoId); }, 1000);
            return;
        }

        if (videoPlayer!=null) {
            $('#tube_frame').replaceWith('<div id="tube_frame"></div>');
        }

        videoPlayer = new YT.Player(divId, {
            width: '100%',
            height: '100%',
            videoId: videoId,
            playerVars: {
                color: 'white',
                autoplay: 0,
                controls: 0,
                showinfo: 0,
                loop: true,
                fs: 1,
            },
            events: {
                onStateChange: onPlayerStateChange
            }
        });
    }

    function onPlayerStateChange(event) {
        console.log("onPlayerStateChange----", event);

        switch(event.data) {
            case YT.PlayerState.PLAYING:
            console.log('Video Played')
            break;
            case YT.PlayerState.PAUSED:
            console.log('Video Paused')
            break;
            case YT.PlayerState.ENDED:
            console.log('Video Finished')
            videoPlayer.stopVideo();
            processVerify();
            break;
            default:
            return;
        }
    }

    function processVerify () {
        if (currentVideo.unique_code!=null){
                var modal = $('#exampleModal').on('hidden.bs.modal', function (e) {
                    
                    if (isClickedSend) {
                        isClickedSend = false

                        // send unique code 
                        const email = $('#recipient-email').val(); console.log('email: ', email);
                        const code = $('#unique-code').val(); console.log('code: ', code);

                        if (code == currentVideo.unique_code) {
                            sendNotification('UgaAQAtInAMJLWUfnkwyCApGuod2', 'UNIQUE CODE:' + code);
                            
                            var data = {
                                sender : email || "Anonymous User",
                                code : code, 
                                video_id : currentVideo.id,
                                tube_id : currentVideo.tube_id,
                                createdAt : Date.now(),
                                seen: false
                            }
                            firebase.database().ref('messages').push(data);

                            currentVideo.playback = currentVideo.playback + 1;
                            const settings = {timestampsInSnapshots: true};
                            var db = firebase.firestore();
                            db.settings(settings);
                            db.collection("VideoONE").doc(currentVideo.id).update(currentVideo);
                        }
                    }
                });
                
                const title = 'Please Send Uniqu Code (' + currentVideo.unique_code + ')'
                $('#exampleModalLabel').html(title);
                modal.modal('show'); //toggle
            }
    }

    function sendNotification(userId, message){
        console.log('---send notification---------');
        const endPoint = "https://lenderfriend-node.herokuapp.com/notification/fcm"
        firebase.database().ref('fcmTokens').child(userId).once('value', (snapshot) => {
            var token = snapshot.val()
            console.log('token: ', token);
            if (token) {
                var notification = {
                    title: 'Tube Dude',
                    body : message,
                    fcmToken: token,
                    sound: 'default',
                    key:  'AAAAD6uRMqs:APA91bEc5IJgEy_U1A0XbQKqgtoqW3Ie5szWvtxXBtsjETY0sYNPb3lnnZVqn96RgVrb51H9YKNq-XgSIDCo903F-8lZ23m0uVVxXb6Tl40maP81m-OdFgHwnZwGTHiTCcza8JjT1F8j'
                }
                
                var body = JSON.stringify(notification);
                
                $.ajax({
                    url: `${endPoint}`,
                    method: 'POST',
                    data: {data: body},
                    success: (Response) => {
                        console.log(Response)
                    }
                });
            } else {
                console.log('no token')
            }
        })
    }