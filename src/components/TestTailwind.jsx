export default function TestTailwind() {
  return (
    <div className="p-8">
      <div className="bg-red-500 text-white p-4 mb-4 rounded">
        ✅ Test Tailwind - Si cette carte est rouge, Tailwind fonctionne !
      </div>
      <div className="bg-blue-500 text-white p-4 mb-4 rounded">
        🎨 Test couleur bleue
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500 text-white p-4 rounded">Colonne 1</div>
        <div className="bg-yellow-500 text-white p-4 rounded">Colonne 2</div>
        <div className="bg-purple-500 text-white p-4 rounded">Colonne 3</div>
      </div>
    </div>
  )
}