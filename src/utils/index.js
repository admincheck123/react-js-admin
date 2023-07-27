export const convertOptionSelect = (data) => {
  if (!data || data.length === 0) return []

  return data.map((item) => {
    return {
      value: item.id || item._id,
      label: item.name,
    };
  })

}