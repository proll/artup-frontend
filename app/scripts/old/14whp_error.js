API_Auth_Failed = 'API_AuthFailed';


WHP.errors = {
    hasNetError : function(_resp)
    {
        if (_resp.error.code == API_Auth_Failed)
        {
            log("WHP/errors : got error = ["+API_Auth_Failed+"]");
            WHP.auth.authError();
            return true;
        }
        return false;
    }
};
