export const helpHttp = () => {
    const customFetch = (endpoint, options) => {
        const defaultHeaders = {
            accept: 'application/json',
        };

        const controller = new AbortController();
        options.signal = controller.signal; //para controlar que el servidor de respuesta y en caso de lo contrario, poder abortar la peticion fetch

        options.method = options.method || 'GET';

        options.headers = options.headers
            ? { ...defaultHeaders, ...options.headers }
            : defaultHeaders;

        options.body = JSON.stringify(options.body) || false; //En peticiones Get no sepude manddar un body vacio o un body en falso
        if (!options.body) delete options.body;

        setTimeout(() => controller.abort(), 3000);

        return fetch(endpoint, options)
            .then((res) =>
                res.ok
                    ? res.json()
                    : Promise.reject({
                          err: true,
                          status: res.status || '00',
                          statusText: res.statusText || 'Ocurrió un error',
                      })
            )
            .catch((err) => {
                /* if (err.code === 20) {
                    err = {
                        err: true,
                        status: err.code,
                        statusText: err.message,
                    };
                } */ //!En caso de querer detectar el error del abort controller usar estas lineas

                return err;
            });
    };

    const get = (url, options = {}) => customFetch(url, options);

    const post = (url, options = {}) => {
        options.method = 'POST';
        return customFetch(url, options);
    };

    const put = (url, options = {}) => {
        options.method = 'PUT';
        return customFetch(url, options);
    };

    const del = (url, options = {}) => {
        options.method = 'DELETE';
        return customFetch(url, options);
    };

    return { get, post, put, del };
};
