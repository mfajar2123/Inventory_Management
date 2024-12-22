const API_URL = '/api/items';

$(document).ready(function () {
 
  const table = $('#itemsTable').DataTable({
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
    ajax: {
      url: API_URL,
      dataSrc: '',
    },
    columns: [
      {
        data: null,
        render: (data, type, row, meta) => meta.row + 1, 
      },
      { data: 'name' },
      { data: 'category' },
      { data: 'quantity' },
      {
        data: null,
        render: (data) => `Rp${(data.quantity * data.pricePerUnit).toLocaleString()}`,
      },
      {
        data: 'dateAdded',
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: null,
render: (data) => `
  <button class="btn btn-info btn-sm detail-btn" data-id="${data._id}">
    <i class="fas fa-eye"></i> Detail
  </button>
  <button class="btn btn-warning btn-sm edit-btn" data-id="${data._id}">
    <i class="fas fa-pencil-alt"></i> Edit
  </button>
  <button class="btn btn-danger btn-sm delete-btn" data-id="${data._id}">
    <i class="fas fa-trash"></i> Hapus
  </button>
`,
        
      },
    ],
    responsive: true, // Enable responsiveness
  });

  // Handle Tambah/Edit Barang
  $('#itemForm').on('submit', async (e) => {
    e.preventDefault();

    const item = {
      name: $('#name').val(),
      category: $('#category').val(),
      quantity: parseInt($('#quantity').val()),
      pricePerUnit: parseInt($('#pricePerUnit').val()),
      dateAdded: $('#dateAdded').val(),
    };

    console.log(item); // Cek apakah data yang dikirim sudah benar
    const itemId = $('#itemId').val();
    const method = itemId ? 'PUT' : 'POST';
    const url = itemId ? `${API_URL}/${itemId}` : API_URL;

   // Validasi tanggal
const currentDate = new Date();
const inputDate = new Date(item.dateAdded);

// Set waktu menjadi 00:00:00 untuk perbandingan tanpa waktu
currentDate.setHours(0, 0, 0, 0);
inputDate.setHours(0, 0, 0, 0);

// Cek jika tanggal lebih besar dari hari ini
if (inputDate > currentDate) {
  Swal.fire({
    icon: 'error',
    title: 'Tanggal Masuk Tidak Valid',
    text: 'Tanggal masuk tidak boleh lebih dari hari ini!',
  });
  return;
}


    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    Swal.fire('Berhasil!', `Barang berhasil ${itemId ? 'diedit' : 'ditambahkan'}!`, 'success');
    $('#itemModal').modal('hide');
    table.ajax.reload();
  });

  // Handle Edit Button
  $('#itemsTable').on('click', '.edit-btn', async function () {
    const itemId = $(this).data('id');
    const res = await fetch(`${API_URL}/${itemId}`);
    const item = await res.json();

    $('#itemId').val(item._id);
    $('#name').val(item.name);
    $('#category').val(item.category);
    $('#quantity').val(item.quantity);
    $('#pricePerUnit').val(item.pricePerUnit);
    $('#dateAdded').val(item.dateAdded.split('T')[0]);

    $('#itemModalLabel').text('Edit Barang');
    $('#itemModal').modal('show');
  });

  // Handle Detail Button
  $('#itemsTable').on('click', '.detail-btn', async function () {
    const itemId = $(this).data('id');
    const res = await fetch(`${API_URL}/${itemId}`);
    const item = await res.json();

    const detailHtml = `
      <p><strong>Nama:</strong> ${item.name}</p>
      <p><strong>Kategori:</strong> ${item.category}</p>
      <p><strong>Jumlah:</strong> ${item.quantity}</p>
      <p><strong>Harga per Unit:</strong> Rp${item.pricePerUnit.toLocaleString()}</p>
      <p><strong>Harga Total:</strong> Rp${(item.quantity * item.pricePerUnit).toLocaleString()}</p>
      <p><strong>Tanggal Masuk:</strong> ${new Date(item.dateAdded).toLocaleDateString()}</p>
    `;

    Swal.fire({
      title: 'Detail Barang',
      html: detailHtml,
      icon: 'info',
      showCloseButton: true,
    });
  });

  // Handle Delete Button
  $('#itemsTable').on('click', '.delete-btn', async function () {
    const itemId = $(this).data('id');

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${API_URL}/${itemId}`, { method: 'DELETE' });
        Swal.fire('Berhasil!', 'Data berhasil dihapus!', 'success');
        table.ajax.reload();
      }
    });
  });

  // Export to CSV
  $('#exportCsv').on('click', function () {
    const rows = [];
    const headers = ['No', 'Nama', 'Kategori', 'Jumlah', 'Harga Total', 'Tanggal Masuk'];
    rows.push(headers);

    table.rows().every(function () {
      const data = this.data();
      const row = [
        this.index() + 1, // No
        data.name,
        data.category,
        data.quantity,
        `Rp${(data.quantity * data.pricePerUnit).toLocaleString()}`,
        new Date(data.dateAdded).toLocaleDateString(),
      ];
      rows.push(row);
    });

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'items.csv';
    link.click();
  });

  // Reset Modal on Close
  $('#itemModal').on('hidden.bs.modal', () => {
    $('#itemForm')[0].reset();
    $('#itemId').val('');
    $('#itemModalLabel').text('Tambah Barang');
  });
});
