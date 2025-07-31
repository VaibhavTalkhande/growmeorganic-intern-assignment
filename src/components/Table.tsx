import { useEffect, useRef, useState } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import {type Product } from '../types/Product';

const Table = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState(50);
  const overlayRef = useRef(null);
  const [bulkCount, setBulkCount] = useState<number>(0);

  const fetchProducts = async (pageNum: number) => {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum}`);
    const data = await response.json();

    const mapped = data.data.map((item: Product) => ({
      id: item.id,
      title: item.title,
      place_of_origin: item.place_of_origin,
      artist_display: item.artist_display,
      inscriptions: item.inscriptions,
      date_start: item.date_start,
      date_end: item.date_end,
    }));

    setProducts(mapped);
    setTotalRecords(data.pagination.total || 120);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);


  const handleBulkSelect = async () => {
    if (bulkCount > 0 && bulkCount <= totalRecords) {
      try {
        const rowsPerPage = 12;
        const pagesNeeded = Math.ceil(bulkCount / rowsPerPage);
        let allSelectedProducts: Product[] = [];
        for (let pageNum = 1; pageNum <= pagesNeeded; pageNum++) {
          const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum}`);
          const data = await response.json();
          
          const mapped = data.data.map((item: Product) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
          }));
          
          allSelectedProducts = [...allSelectedProducts, ...mapped];
        }
        
        const finalSelection = allSelectedProducts.slice(0, bulkCount);
        setSelectedProducts(finalSelection);
        (overlayRef.current as any)?.hide();
      } catch (error) {
        console.error('Error fetching bulk selection:', error);
        alert('Error fetching the selected rows. Please try again.');
      }
    } else {
      alert('Please enter a valid number of rows to select.');
    }
  }

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          selectionMode="multiple"
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          
        >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem', textAlign: 'center' }}
          headerClassName="p-text-center"
          bodyClassName="p-text-center"
          header={() => (
            <div className="absolute top-[1.5rem] left-[2rem]  p-d-flex p-ai-center">
              <Button
                icon="pi pi-angle-down pi-rotate-180"
                className="p-button-text"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
                onClick={e => (overlayRef.current as any)?.toggle(e)}
              />
            </div>
          )}
        />
          <Column field="id" header="ID" />
          <Column field="title" header="Title"  />
          <Column field="place_of_origin" header="Place of Origin"  />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
        <Paginator
          first={(page - 1) * 10}
          rows={10}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={(e: PaginatorPageChangeEvent) => {
            setPage(e.page + 1);
          }}

        />
        <OverlayPanel ref={overlayRef} showCloseIcon>
          <div className="p-p-3">
            <h4>Select Rows</h4>
            <InputNumber
              value={bulkCount}
              onValueChange={e => setBulkCount(e.value || 0)}
              placeholder="Number of rows"
            />
            <Button
              label="Confirm"
              className="p-mt-2 mb-1 ml-2 p-button-sm p-button-success"
              onClick={handleBulkSelect}
            />
          </div>
        </OverlayPanel>
      </div>
    </>
  );
}

export default Table;