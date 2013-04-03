WHP.opengraph = {
    makeLikeAction : function(_photoId)
    {
        if (!WHP.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:like', 'post', { photo : WHP.links.getPhotoLink(_photoId)}, function(response) {
        FB.api('/me/weheartpics:like', 'post', { photo : "http://weheartpics.com/photo/"+_photoId+"/"}, function(response) {
            log(response);
        });

    },

    makeFolowAction : function(_userId)
    {
        if (!WHP.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:follow', 'post', { user : WHP.links.getUserProfileLink(_userId) }, function(response) {
        setTimeout(bind(function(){
        FB.api('/me/weheartpics:follow', 'post', { user : "http://weheartpics.com/user/"+_userId+"/" }, function(response) {
            log(response);
        });
        },this),100);
    },

    makeCommentAction : function(_photoId)
    {
        if (!WHP.settings.useOpenGraph)
            return false;
        //FB.api('/me/weheartpics:follow', 'post', { user : WHP.links.getUserProfileLink(_userId) }, function(response) {
        setTimeout(bind(function(){
            FB.api('/me/weheartpics:comment', 'post', { photo : "http://weheartpics.com/photo/"+_photoId+"/" }, function(response) {
                log(response);
            });
        },this),100);
    }
}


