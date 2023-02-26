import { App } from "vue";
import focus from "./modules/focus";

const directivesList: any = {
	// Custom directives
  focus
};

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach(key => {
			// 注册所有自定义指令
			app.directive(key, directivesList[key]);
		});
	}
};

export default directives;
