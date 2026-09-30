import { NotionAPI } from "notion-client"
import { getPageContentBlockIds } from "notion-utils"

// 레코드 이중 래핑 정규화 함수
function normalizeRecordMap(recordMap: any) {
  const tables = ["block", "collection", "collection_view", "notion_user"] as const
  for (const table of tables) {
    if (!recordMap[table]) continue
    for (const id in recordMap[table]) {
      const record = recordMap[table][id]
      if (record?.value?.value !== undefined) {
        recordMap[table][id] = { role: record.value.role, value: record.value.value }
      }
    }
  }
}

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  const recordMap = await api.getPage(pageId)

  // 1. recordMap 수령 즉시 이중 래핑 정규화 수행
  normalizeRecordMap(recordMap)

  // 2. 정규화된 상태에서 누락된 자식 블록들 재귀 fetch (글 잘림 방지)
  for (;;) {
    const allIds = getPageContentBlockIds(recordMap as any)
    const missingIds = allIds.filter((id) => !recordMap.block[id])
    if (!missingIds.length) break

    const fetched = (await api.getBlocks(missingIds)).recordMap.block
    for (const id in fetched) {
      const record = fetched[id] as any
      if (record?.value?.value !== undefined) {
        fetched[id] = { role: record.value.role, value: record.value.value }
      }
    }
    Object.assign(recordMap.block, fetched)
  }

  return recordMap
}