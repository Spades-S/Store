// tslint:disable no-console

import { Depends } from './dep';

export default class Store<State, Action> {
	private activeListener: () => any = null;
	private isSub: boolean = true; // 当前是订阅 还是取消订阅
	private token: number; // 取消订阅时的token
	private state: State;
	private isDispatching: boolean = false;
	private reducer: (preState: State, action: Action) => State;
	constructor(state: State, reducer: (preState: State, action: Action) => State) {
		this.state = state;
		this.reducer = reducer;
		this.walk(this.state);
	}

	public walk(object: any) {
		for (const prop of Object.getOwnPropertyNames(object)) {
			switch (Object.prototype.toString.call(object[prop])) {
				case '[object Object]':
					this.walk(object[prop]);
					break;
				case '[object Array]':
					// 针对数组的处理
					this.defineArrayReactive(object, prop);
					break;
				default:
					this.defineReactive(object[prop], prop);
					break;
			}
		}
	}

	public defineArrayReactive(object: any, prop: string) {}

	public defineReactive(object: any, prop: string) {
		const dep = new Depends();
		let value = object[prop];
		Object.defineProperty(object, prop, {
			get() {
				if (this.isSub) {
					dep.depend(this.activeListener);
				} else {
					dep.remove(this.token);
				}
				return value;
			},
			set(val: any) {
				dep.update();
				value = val;
			},
		});
	}

	public dispatch(action: Action) {
		this.checkIsDiapatching();
		this.isDispatching = true;
		this.state = this.reducer(this.state, action);
		this.isDispatching = false;
	}

	public getState() {
		this.checkIsDiapatching();
		return this.state;
	}

	public subscribe(target: any, listener: () => any) {
		this.activeListener = listener;
		this.isSub = true;
		// 触发getter
		Object.prototype.toString.call(target);
	}

	public unsubscribe(target: any, token: number) {
		this.token = token;
		this.isSub = false;
		// 触发getter;
		Object.prototype.toString.call(target);
	}

	private checkIsDiapatching() {
		if (this.isDispatching) {
			throw new Error('is Dispatching...');
		}
	}
}
