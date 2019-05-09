type Listener = () => any;

export class Depends {
	private subs: Map<number, Listener> = new Map();

	public depend(listener: Listener) {
		const token = new Date().getTime();
		this.subs.set(token, listener);
	}

	public update() {
		const toRun: Listener[] = [];
		for (const listener of this.subs.values()) {
			if (!toRun.includes(listener)) {
				toRun.push(listener);
			}
		}

		setTimeout(() => {
			toRun.forEach(item => {
				item();
			});
		}, 0);
	}

	public remove(token: number) {
		this.subs.delete(token);
	}
}
