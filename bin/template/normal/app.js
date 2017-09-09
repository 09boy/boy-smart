import './style';

const createEl = (elType, content, children = null) => {
	const el = document.createElement(elType);
	el.innerHTML = content;
	if (children) {
		el.appendChild(children);
	}
	return el;
};

const h2 = createEl('h2', 'Normal Porject is Created.');
const container = createEl('div', '', h2);

container.className = 'page';

export default () => container;