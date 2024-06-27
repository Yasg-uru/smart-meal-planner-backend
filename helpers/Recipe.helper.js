export function AdjustedIngredientQuantity(OriginalQuantity, persons) {
    const QuantityParts = OriginalQuantity.split(" ");
    const numericvalue = parseFloat(QuantityParts[0]);
    const unit = QuantityParts.slice(1);
    if (!isNaN(numericvalue)) {
      const adjustedValue = numericvalue * (persons / 4);
      return `${adjustedValue} ${unit}`;
    } else {
      return OriginalQuantity;
    }
  }