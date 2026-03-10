const subscribedChatIds = new Set<number>();

export function subscribe(chatId: number): void {
  subscribedChatIds.add(chatId);
}

export function unsubscribe(chatId: number): void {
  subscribedChatIds.delete(chatId);
}

export function hasSubscribers(): boolean {
  return subscribedChatIds.size > 0;
}

export function getSubscriberIds(): ReadonlySet<number> {
  return subscribedChatIds;
}
