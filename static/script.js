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
	const allianceSelect = document.getElementById('alliance_select');
	const saveAllianceButton = document.getElementById('save_alliance');
	const createAllianceButton = document.getElementById('create_alliance');
	const adminSection = document.getElementById('admin_section');

	const bannerCosts = {
		meat: 201300,
		wood: 201300,
		coal: 134200,
		iron: 73200
	};

	const urlParams = new URLSearchParams(window.location.search);
	const adminPassword = urlParams.get('admin');

	function calculateMaxBannersPerDay(rate, costPerBanner) {
		return Math.floor((rate * 24) / costPerBanner);
	}

	function updateFarms() {
		const meatRate = parseInt(meatRateInput.value) || 0;
		const woodRate = parseInt(woodRateInput.value) || 0;
		const coalRate = parseInt(coalRateInput.value) || 0;
		const ironRate = parseInt(ironRateInput.value) || 0;

		const meatFarms = calculateMaxBannersPerDay(meatRate, bannerCosts.meat);
		const woodFarms = calculateMaxBannersPerDay(woodRate, bannerCosts.wood);
		const coalFarms = calculateMaxBannersPerDay(coalRate, bannerCosts.coal);
		const ironFarms = calculateMaxBannersPerDay(ironRate, bannerCosts.iron);

		meatFarmsElement.textContent = meatFarms;
		woodFarmsElement.textContent = woodFarms;
		coalFarmsElement.textContent = coalFarms;
		ironFarmsElement.textContent = ironFarms;

		const maxBannersPerDay = Math.min(meatFarms, woodFarms, coalFarms, ironFarms);

		updateTable(maxBannersPerDay, meatFarms, woodFarms, coalFarms, ironFarms);
	}

	function updateTable(maxBannersPerDay, meatFarms, woodFarms, coalFarms, ironFarms) {
		bannersTableBody.innerHTML = '';

		for (let banners = maxBannersPerDay; banners <= maxBannersPerDay + 7; banners++) {
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

	function loadAlliance(allianceName) {
		fetch(`/load_alliance?alliance=${allianceName}`)
			.then(response => response.json())
			.then(alliance => {
				meatRateInput.value = alliance.meat_rate;
				woodRateInput.value = alliance.wood_rate;
				coalRateInput.value = alliance.coal_rate;
				ironRateInput.value = alliance.iron_rate;
				updateFarms();
			});
	}

	function saveAlliance() {
		const allianceName = allianceSelect.value;
		const allianceData = {
			name: allianceName,
			meat_rate: parseInt(meatRateInput.value) || 0,
			wood_rate: parseInt(woodRateInput.value) || 0,
			coal_rate: parseInt(coalRateInput.value) || 0,
			iron_rate: parseInt(ironRateInput.value) || 0
		};

		fetch(`/save_alliance?admin=${adminPassword}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(allianceData)
		})
		.then(response => {
			if (response.ok) {
				alert('Alliance data saved successfully!');
			} else {
				alert('Failed to save alliance data.');
			}
		});
	}

	function createAlliance() {
		const allianceName = prompt("Enter the new alliance name:");
		if (!allianceName) return;

		const allianceData = {
			name: allianceName,
			meat_rate: parseInt(meatRateInput.value) || 0,
			wood_rate: parseInt(woodRateInput.value) || 0,
			coal_rate: parseInt(coalRateInput.value) || 0,
			iron_rate: parseInt(ironRateInput.value) || 0
		};

		fetch(`/create_alliance?admin=${adminPassword}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(allianceData)
		})
		.then(response => {
			if (response.ok) {
				alert('Alliance created successfully!');
				window.location.reload();
			} else if (response.status === 400) {
				alert('Alliance already exists.');
			} else {
				alert('Failed to create alliance.');
			}
		});
	}

	allianceSelect.addEventListener('change', function() {
		const selectedAlliance = allianceSelect.value;
		if (selectedAlliance) {
			loadAlliance(selectedAlliance);
		}
	});

	saveAllianceButton.addEventListener('click', saveAlliance);
	createAllianceButton.addEventListener('click', createAlliance);

	if (adminPassword) {
		adminSection.style.display = 'block';
	}

	updateFarms(); // Initial calculation
});

