export function importAllFunctions(
    requireContext: __WebpackModuleApi.RequireContext
) {
    const req = requireContext
        .keys()
        .sort()
        .reduce((reduced, key) => {
            if (!reduced.map(x => x.split('/').pop()).includes(key.split('/').pop()))
                reduced.push(key);
            return reduced;
        }, [] as any)
        .map((filename) => {
            const required = requireContext(filename);
            return Object.keys(required).reduce(
                (result, exportedKey) => {
                    const exported = required[exportedKey];
                    if (typeof exported === 'function')
                        return result.concat(exported);
                    return result;
                },
                [] as any
            );
        })
        .flat();

    return req;
}
