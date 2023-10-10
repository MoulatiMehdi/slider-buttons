/**
 * create an HTML element
 * @param {keyof HTMLElementTagNameMap} name
 * @param {object} attributes
 * @param {(string | Node)[]} nodes
 */
function createTag(name, attributes = {}, nodes = null) {
	const elem = document.createElement(name);
	for (let key in attributes) {
		elem.setAttribute(key, attributes[key]);
	}

	if (nodes) {
		elem.append(...nodes);
	}
	return elem;
}

var currSlider = 0; // current  active slide (from 0 -> TOTAL_SLIDERS - 1 )
const sliders = []; //  sliders elements (li)

const TOTAL_SLIDERS = 18; // Total number of slides
const SLIDERS_PER_GROUP = 5; // number of slides per each group
const BTN_CLASS = "btn btn-purple"; // default btn class

const prevGrBt = createTag("button", { class: BTN_CLASS }, "<<");
const nextGrBt = createTag("button", { class: BTN_CLASS }, ">>");
const nextBtn = createTag("button", { class: BTN_CLASS }, "Next->");
const preBtn = createTag("button", { class: BTN_CLASS }, "<-Prev");

const slidersContainer = createTag("ul");

const childDiv = createTag("div", { class: "cont-child", id: "child-id" }, [
	slidersContainer,
]);

const parentDiv = createTag("div", { class: "container", id: "divParent" }, [
	prevGrBt,
	preBtn,
	childDiv,
	nextBtn,
	nextGrBt,
]);

document.body.appendChild(parentDiv);

// create list elements
for (let i = 0; i < SLIDERS_PER_GROUP; i++) {
	const li = document.createElement("li");
	slidersContainer.appendChild(li);
	sliders[i] = li;
}

updateIndexes();
updateBtns();

// event handlers
function nextSlider() {
	if (nextBtn.disabled) {
		console.log("next button is disabled");
		return false;
	}

	// is the current slider is the last element of the list (5*k )
	setCurrSlider(currSlider + 1);
	if (currSlider % SLIDERS_PER_GROUP === 0) {
		updateIndexes();
	}
}
function prevSlider() {
	if (preBtn.disabled) {
		console.log("prev button is disabled");
		return false;
	}
	setCurrSlider(currSlider - 1);
	if (currSlider % SLIDERS_PER_GROUP === 4) {
		updateIndexes();
	}
}
function nextGroup() {
	if (nextGrBt.disabled) {
		console.warn("button nextGr is disabled");
		return false;
	} else {
		setCurrSlider(currSlider + SLIDERS_PER_GROUP);
		updateIndexes();
	}
}
function prevGroup() {
	if (prevGrBt.disabled) {
		console.log("button prevGr is disabled");
		return false;
	} else {
		setCurrSlider(currSlider - SLIDERS_PER_GROUP);
		updateIndexes();
	}
}

// : help functions

/**
 * Make sure that the varaible currSlider is a number between 0 and ``TOTAL_SLIDES``
 */
function checkVar() {
	if (currSlider == undefined || currSlider < 0) {
		currSlider = 0;
	}
	if (currSlider >= TOTAL_SLIDERS) {
		currSlider = TOTAL_SLIDERS - 1;
	}
}
function isFirstSlider() {
	return currSlider === 0;
}

function isLastSlider() {
	return currSlider === TOTAL_SLIDERS - 1;
}

function isLastGroup() {
	return currSlider >= TOTAL_SLIDERS - SLIDERS_PER_GROUP;
}

function isFirstGroup() {
	return currSlider < SLIDERS_PER_GROUP;
}

function isNextSlideNewGroup() {
	let x = currSlider % SLIDERS_PER_GROUP;
	return x === 4 || x === 0;
}

function setCurrSlider(value) {
	currSlider = value;
	checkVar();
}
//  UI functions

function updateBtns() {
	preBtn.disabled = isFirstSlider();
	nextBtn.disabled = isLastSlider();
	nextGrBt.disabled = isLastGroup();
	prevGrBt.disabled = isFirstGroup();

	activateSlider(currSlider);
}

function updateIndexes() {
	const start = currSlider - (currSlider % SLIDERS_PER_GROUP);
	for (let i = 0; i < SLIDERS_PER_GROUP; i++) {
		const nbr = i + start;
		sliders[i].style.display = nbr > TOTAL_SLIDERS ? "none" : "";
		sliders[i].innerText = nbr + 1;
	}
}

function activateSlider(currSlider) {
	const index = currSlider % SLIDERS_PER_GROUP;
	sliders[index]?.classList.add("active");
}

function disactiveSliders() {
	sliders.forEach((sl) => {
		sl.classList.remove("active");
	});
}

//       events

function update(func = () => {}) {
	var curr = currSlider;
	disactiveSliders();
	func();
	checkVar();
	updateBtns();

	console.log(curr + 1, "->", currSlider + 1);
}
nextBtn.onclick = () => {
	update(nextSlider);
};
preBtn.onclick = () => {
	update(prevSlider);
};
nextGrBt.onclick = () => {
	update(nextGroup);
};
prevGrBt.onclick = () => {
	update(prevGroup);
};
