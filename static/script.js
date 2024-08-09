document.addEventListener('DOMContentLoaded', function() {
	const meatRateInput = document.getElementById('meat_rate');
	const woodRateInput = document.getElementById('wood_rate');
	const coalRateInput = document.getElementById('coal_rate');
	const ironRateInput = document.getElementById('iron_rate');

	const meatFarmsElement = document.getElementById('meat_farms');
	const woodFarmsElement = document.getElementById('wood_farms');
	const coalFarmsElement = document.getElementById('coal_farms');
	const ironFarmsElement = document.getElementById('iron_farms');

	const bannersTableBody = document.getElementById('banners_table');

	const bannerCosts = {
		meat: 201300,
		wood: 201300,
		coal: 134200,
		iron: 73200
	};

	function calculateFarms(rate, costPerBanner) {
		return Math.floor((rate * 24) / costPerBanner);
	}

	function updateFarms() {
		const meatRate = parseInt(meatRateInput.value) || 0;
		const woodRate = parseInt(woodRateInput.value) || 0;
		const coalRate = parseInt(coalRateInput.value) || 0;
		const ironRate = parseInt(ironRateInput.value) || 0;

		const meatFarms = calculateFarms(meatRate, bannerCosts.meat);
		const woodFarms = calculateFarms(woodRate, bannerCosts.wood);
		const coalFarms = calculateFarms(coalRate, bannerCosts.coal);
		const ironFarms = calculateFarms(ironRate, bannerCosts.iron);

		meatFarmsElement.textContent = meatFarms;
		woodFarmsElement.textContent = woodFarms;
		coalFarmsElement.textContent = coalFarms;
		ironFarmsElement.textContent = ironFarms;

		updateTable(meatFarms, woodFarms, coalFarms, ironFarms);
	}

	function updateTable(meatFarms, woodFarms, coalFarms, ironFarms) {
		bannersTableBody.innerHTML = '';

		for (let banners = meatFarms; banners <= meatFarms + 7; banners++) {
			const extraMeatFarms = Math.max(0, Math.ceil(((banners * bannerCosts.meat) / (24 * 3600)) - meatFarms));
			const extraWoodFarms = Math.max(0, Math.ceil(((banners * bannerCosts.wood) / (24 * 3600)) - woodFarms));
			const extraCoalFarms = Math.max(0, Math.ceil(((banners * bannerCosts.coal) / (24 * 3600)) - coalFarms));
			const extraIronFarms = Math.max(0, Math.ceil(((banners * bannerCosts.iron) / (24 * 3600)) - ironFarms));

			const row = `<tr>
				<td>${banners}</td>
				<td>${extraMeatFarms}</td>
				<td>${extraWoodFarms}</td>
				<td>${extraCoalFarms}</td>
				<td>${extraIronFarms}</td>
			</tr>`;

			bannersTableBody.innerHTML += row;
		}
	}

	meatRateInput.addEventListener('input', updateFarms);
	woodRateInput.addEventListener('input', updateFarms);
	coalRateInput.addEventListener('input', updateFarms);
	ironRateInput.addEventListener('input', updateFarms);

	updateFarms(); // Initial calculation
});

