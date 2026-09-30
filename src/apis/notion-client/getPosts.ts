import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

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

// ⬇️ 반환 타입 명시: Promise<TPosts> 추가
export const getPosts = async (): Promise<TPosts> => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(id)

  normalizeRecordMap(response)

  if (Object.keys(response.collection_query).length === 0) {
    const rawBlock = response.block[id]?.value as any
    const rawMetadataForQuery = rawBlock?.value ?? rawBlock

    if (
      rawMetadataForQuery?.type === "collection_view_page" ||
      rawMetadataForQuery?.type === "collection_view"
    ) {
      const collectionId = Object.keys(response.collection)[0]
      const viewIds: string[] = rawMetadataForQuery?.view_ids || []
      for (const viewId of viewIds) {
        try {
          const collectionView = (response.collection_view[viewId]?.value as any)?.value ?? response.collection_view[viewId]?.value
          const collectionData = await api.getCollectionData(collectionId, viewId, collectionView)
          if (!response.collection_query[collectionId]) {
            response.collection_query[collectionId] = {}
          }
          response.collection_query[collectionId][viewId] =
            (collectionData as any)?.result?.reducerResults
        } catch (e) {
          console.warn("Failed to fetch collection data for view", viewId, e)
        }
      }
    }
  }

  id = idToUuid(id)
  const collectionValue = Object.values(response.collection)[0]?.value as any
  const collection = collectionValue?.value ?? collectionValue
  const block = response.block
  const schema = collection?.schema

  const blockValue = (block[id]?.value as any)?.value ?? block[id]?.value
  const rawMetadata = blockValue

  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    const pageIds = getAllPageIds(response)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const pageId = pageIds[i]
      const properties = (await getPageProperties(pageId, block, schema)) || null
      if (!properties) continue

      const pageBlockValue = (block[pageId]?.value as any)?.value ?? block[pageId]?.value
      properties.createdTime = new Date(
        pageBlockValue?.created_time
      ).toString()
      properties.fullWidth =
        (pageBlockValue?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts

    return JSON.parse(JSON.stringify(posts))
  }
}