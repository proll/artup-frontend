aup.opengraph = {
    makeLikeAction : function(_photoId)
    {
        if (!aup.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:like', 'post', { photo : aup.links.getPhotoLink(_photoId)}, function(response) {
        FB.api('/me/weheartpics:like', 'post', { photo : "http://weheartpics.com/photo/"+_photoId+"/"}, function(response) {
            log(response);
        });

    },

    makeFolowAction : function(_userId)
    {
        if (!aup.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:follow', 'post', { user : aup.links.getUserProfileLink(_userId) }, function(response) {
        setTimeout(bind(function(){
        FB.api('/me/weheartpics:follow', 'post', { user : "http://weheartpics.com/user/"+_userId+"/" }, function(response) {
            log(response);
        });
        },this),100);
    },

    makeCommentAction : function(_photoId)
    {
        if (!aup.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:follow', 'post', { user : aup.links.getUserProfileLink(_userId) }, function(response) {
        setTimeout(bind(function(){
            FB.api('/me/weheartpics:comment', 'post', { photo : "http://weheartpics.com/photo/"+_photoId+"/" }, function(response) {
                log(response);
            });
        },this),100);
    }
}


