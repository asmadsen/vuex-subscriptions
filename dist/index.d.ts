export interface subscriptions {
    [propName: string]: (state: any) => any | Array<(state: any) => any>;
}
export default function addSubscriptions({subscriptions, subscriber}?: {
    subscriptions?: subscriptions;
    subscriber?: (store: any) => (handler: any) => any;
}): (store: any) => void;
