
export function search(query: string, content: string | string[]): boolean {
    const terms = query.split(/[ "\._,:;-]/g).map(term => term.toLowerCase());

    if(typeof content === 'string') {
        return terms.every((term) => content.toLowerCase().includes(term));
    }


    return terms.every(term => content.some(field => field.toLowerCase().includes(term)))
}