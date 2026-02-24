import Container from "@/components/custom/container";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>

          <div className="h-10 w-full bg-gray-200 rounded mb-8"></div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-24 h-1 mx-2 bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-24 h-1 mx-2 bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  <div>
                    <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="h-10 w-40 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-8 w-36 bg-gray-200 rounded mb-4"></div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-3 flex gap-3">
                      <div className="w-16 h-10 bg-gray-200 rounded"></div>
                      <div className="flex-grow">
                        <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
