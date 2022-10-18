export class CookieManager {

    static getItem(
        cookies: string,
        sKey: string
    ): string {
        if (!sKey || !cookies)
            return null;

        return decodeURIComponent(
            cookies.replace(
                new RegExp(
                    `(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`
                ), '$1'
            )
        ) || null;
    }

    static setItem(
        cookies: string = '',
        sKey: string = '',
        sValue: string = '',
        vEnd?: number | string | Date,
        sPath: string = '/',
        sDomain: string = '',
        bSecure: string = ''
    ): string {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey))
            return cookies;

        let sExpires: string = '';
        if (vEnd) {
            if (typeof vEnd === 'number')
                sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
            if (typeof vEnd === 'string')
                sExpires = `; expires=${vEnd}`;
            if (vEnd instanceof Date)
                sExpires = `; expires=${vEnd.toUTCString()}`;
        }

        return `${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${sDomain ? '; domain=' + sDomain : ''}${sPath ? '; path=' + sPath : '/'}${bSecure ? '; secure' : ''}`;
    }

    static removeItem(cookies: string, sKey: string, sPath: string = '/', sDomain?: string): string {
        if (!CookieManager.hasItem(cookies, sKey))
            return cookies;
        return CookieManager.setItem(cookies, sKey, '', new Date(`1970-01-01T00:00:00.000Z`), sPath, sDomain, null);
    }

    static hasItem(cookies: string, sKey: string): boolean {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey))
            return false;

        return (
            new RegExp(
                `(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=`
            )
        ).test(cookies);
    }

    static keys(cookies: string): string[] {

        const aKeys: string[] = cookies.replace(
            /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, ''
        ).split(/\s*(?:\=[^;]*)?;\s*/);

        for (let nIdx: number = 0, nLen: number = aKeys.length; nIdx < nLen; nIdx++)
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);

        return aKeys;
    }

}
