for (let i = 0; i < 20; i++) {
	let newRow = document.createElement('div');
	newRow.className = 'row'
	document.body.appendChild(newRow)
	for (let j = 0; j < 20; j++) {
		let newBlock = document.createElement('div');
		newBlock.className = 'block';
		newBlock.id = `block-${i}-${j}`;
		newRow.appendChild(newBlock)
	}
}
