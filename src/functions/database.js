import { useMetadataStore } from '@/stores/metadata.js'
import PouchDB from 'pouchdb-browser'
import { ref } from 'vue'

export async function getOrCreateDoc (database, id) {
  try {
    return await database.get(id)
  } catch (e) {
    if (e.status !== 404) return null
    await database.put({ _id: id })
    return await database.get(id)
  }
}

export async function getDatabaseConnection (databaseId) {
  const databaseStore = useMetadataStore()
  const databaseInfo = await databaseStore.getConnectionInfo(databaseId)
  const database = new PouchDB(databaseInfo.connectionOptions)
  const documents = ref([])
  const currentDocumentId = ref('')
  const currentRoute = ref([])

  database.changes({
    since: 'now',
    live: true
  }).on('change', async function (change) {
    await fetchDocuments()
  }).on('error', function (err) {
    console.log(err)
  })

  async function fetchDocuments (parentId = currentDocumentId.value) {
    const allDocs = await database.find({
      selector: { parent_id: parentId ?? false }
    })
    documents.value = allDocs.docs.sort((a, b) => a.order > b.order ? 1 : -1)
    await fetchCurrentDocumentRoute()
  }

  async function fetchCurrentDocumentRoute () {
    let parentId = currentDocumentId.value
    const route = []
    while (parentId) {
      const parentDocument = await database.get(parentId)
      route.push({
        id: parentId,
        name: parentDocument.name
      })
      parentId = parentDocument.parent_id
    }
    currentRoute.value = route.reverse()
  }

  async function createDocument (value, widget) {
    const docsLength = documents.value.length
    await database.post({
      value: widget.index === 'text' ? value : widget.defaultValue,
      name: widget.index === 'text' ? '' : value,
      type: widget.index,
      index_value: widget.indexValue,
      parent_id: currentDocumentId.value ?? false,
      order: docsLength ? documents.value[docsLength - 1].order + 100 : 0
    })
    await fetchDocuments()
  }

  async function updateDocument (document, value) {
    document.value = value
    await database.put(document)
    await fetchDocuments()
  }

  async function deleteDocument (document) {
    await database.remove(document)
    await fetchDocuments()
  }

  async function setCurrentDocument (documentId) {
    currentDocumentId.value = documentId
    await fetchDocuments()
  }

  return {
    id: databaseId,
    currentDocumentId,
    currentRoute,
    documents,
    fetchDocuments,
    setCurrentDocument,
    createDocument,
    updateDocument,
    deleteDocument
  }
}
