API_Auth_Failed = 'API_AuthFailed';


aup.errors = {
    hasNetError : function(_resp)
    {
        if (_resp.error.code == API_Auth_Failed)
        {
            log("aup/errors : got error = ["+API_Auth_Failed+"]");
            aup.auth.authError();
            return true;
        }
        return false;
    }
};
