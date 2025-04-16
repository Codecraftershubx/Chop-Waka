const calculateCustomizationPrice = (itemInfo, customizations) => {
    let priceAdjustment = 0;

    for (const [key, value] of Object.entries(customizations)) {
        const options = itemInfo.customizationOptions[key];

        if (Array.isArray(value)) {
            value.forEach(selectedOptionId => {
                const selectedOption = options.find(
                    option => option.id == selectedOptionId
                );
                if (selectedOption) {
                    priceAdjustment += selectedOption.price || selectedOption.priceAdjustment || 0;
                }
            });
        } else {
            const selectedOption = options.find(
                option => option.id == value
            );
            if (selectedOption) {
                priceAdjustment += selectedOption.price || selectedOption.priceAdjustment || 0;
            }
        }
    }
}

return priceAdjustment;