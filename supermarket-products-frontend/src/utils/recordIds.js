export const entityId = (entity) => encodeURIComponent(String(entity.id ?? entity._id))
export const idOf = (record) => String(record?.id ?? record?._id ?? '')
