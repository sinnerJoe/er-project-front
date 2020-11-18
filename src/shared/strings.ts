const labels = {
    fieldRequired: '{0} is required',
    firstName: 'First Name',
    lastName: 'Last Name',
    password: 'Password',
    emailAddress: 'Email Address'
}

const composableLabels: {[k: string]: (...args: string[]) => string} = new Proxy(labels, {
    get(target, label) {
        return function(...args: string[]) {
            return Array.from(args).reduce(
                (acc: string, filler, index) => acc.split(`{${index}}`).join(filler), 
                target[label]);
        }
    }
}) as any;

export {labels, composableLabels};