// * Menu
declare namespace Menu {
	interface MenuOptions {
		path: string;
		name?: string;
		component?: string | (() => Promise<any>);
		redirect?: string;
		meta: MetaProps;
		children?: MenuOptions[];
	}
	interface MetaProps {
		icon?: string;
		title: string;
		activeMenu?: string;
		isLink?: string;
		isHide?: boolean;
		isFull?: boolean;
		closeable?: boolean;
		isKeepAlive?: boolean;
		roles?: string[];
	}
}

