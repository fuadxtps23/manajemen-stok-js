const rd = require("readline-sync");
const fs = require("fs");

console.log("Selamat datang di Aplikasi Manajemen Stok Barang!");

const namaToko = "Toko Buku ABC";
const tanggalHariIni = new Date().toLocaleDateString();

// Dasar gak pake OOP

// const barang1 = {id: 1, nama: "Pulpen", stok: 50, harga: 2500};
// const daftarBarang = [
//     {id:1 , nama: "Pulpen", stok: 50, harga: 2500},
//     {id:2, nama: "Buku Tulis", stok: 30, harga: 5000},
// ];
//
// function tambahBarang(nama, stok, harga) {
//     const id = daftarBarang.length + 1;
//     daftarBarang.push({id, nama, stok, harga});
//     return daftarBarang;
// }
//
// function tampilkanBarang() {
//     daftarBarang.forEach((barang) => {
//     console.log(`ID: ${barang.id}, Nama: ${barang.nama}, Stok: ${barang.stok}, Harga: Rp${barang.harga}`);
//     });
// }
//
// function barangMasuk(id, jumlah) {
//     const barang = daftarBarang.find((barang) => barang.id === id);
//     barang.stok += jumlah;
// }
//
// function barangKeluar(id, jumlah) {
//     const barang = daftarBarang.find((barang) => barang.id === id);
//     barang.stok -= jumlah;
// }
//
// tambahBarang("Pensil", 100, 1000);
// tampilkanBarang();
// barangMasuk(1, 20);
// tampilkanBarang();
// barangKeluar(2, 10);
// tampilkanBarang();


// Refactor ke Class (OOP)
class StokManager {
    constructor() {
        this.daftarBarang = [];
    }

    tambah(nama, stok, harga) {
        const idBaru = this.daftarBarang.length + 1;
        this.daftarBarang.push({ id: idBaru, nama, stok, harga });
    }

    tampilkan() {
        this.daftarBarang.forEach((b) => {
            console.log(`ID: ${b.id}, Nama: ${b.nama}, Stok: ${b.stok}, Harga: Rp${b.harga}`);
        });
    }

    barangMasuk(id, jumlah) {
        const barang = this.daftarBarang.find((b) => b.id === id);
        if (barang) barang.stok += jumlah;
    }

    barangKeluar(id, jumlah) {
        const barang = this.daftarBarang.find((b) => b.id === id);
        if (barang && barang.stok >= jumlah) {
            barang.stok -= jumlah;
        } else {
            console.log(`Stok barang dengan ID ${id} tidak cukup untuk keluar sebanyak ${jumlah}.`);
        }
    }

    ubahHarga(id, hargaBaru) {
        const barang = this.daftarBarang.find((b) => b.id === id);
        barang.harga = hargaBaru;
        console.log(`Harga barang dengan ID ${id} berhasil diubah menjadi Rp${hargaBaru}.`);
    }

    hapus(id) {
        this.daftarBarang = this.daftarBarang.filter((b) => b.id !== id);
    }

    cekStokMenipis(batas = 10) {
        const stokSeret = this.daftarBarang.filter((b) => b.stok <= batas);
        console.log(`\nBarang dengan stok menipis (<= ${batas}):`);
        console.log("--------------");
        return stokSeret.forEach((b) => {
            console.log(`ID: ${b.id}, Nama: ${b.nama}, Stok: ${b.stok}, Harga: Rp${b.harga}`);
        });
    }

    simpan() {
        fs.writeFileSync("stok.json", JSON.stringify(this.daftarBarang, null, 2));
    }

    muat() {
        if (fs.existsSync("stok.json")) {
            const data = fs.readFileSync("stok.json", "utf-8");
            this.daftarBarang = JSON.parse(data);
        }
    }
}

const manager = new StokManager();
manager.muat();

while (true) {
    console.log("\nMenu:");
    console.log("1. Tambah Barang\n2. Tampilkan Barang\n3. Barang Masuk\n4. Barang Keluar\n5. Hapus Barang\n6. Cek Stok Menipis\n7. Ubah Harga Barang\n8. Keluar");

    const pilihan = rd.questionInt("Pilih menu (1-8): ");

    switch (pilihan) {
        case 1: {
            const nama = rd.question("Nama barang: ");
            const stok = rd.questionInt("Stok awal: ");
            const harga = rd.questionInt("Harga satuan: ");
            manager.tambah(nama, stok, harga);
            manager.simpan();
            console.log("barang berhasil ditambahkan");
            break;
        }
        case 2: {
            console.log("--------------");
            manager.tampilkan();
            console.log("--------------");
            break;
        }
        case 3: {
            console.log("--------------");
            manager.tampilkan();
            console.log("--------------");
            const id = rd.questionInt("ID barang: ");
            const jumlah = rd.questionInt("Jumlah barang yang masuk: ");
            console.log("jumlah barang berhasil ditambahkan");
            manager.barangMasuk(id, jumlah);
            manager.simpan();
            break;
        }
        case 4: {
            console.log("--------------");
            manager.tampilkan();
            console.log("--------------");
            const id = rd.questionInt("ID barang: ");
            const jumlah = rd.questionInt("Jumlah barang yang keluar: ");
            console.log("jumlah barang berhasil dikurangi");
            manager.barangKeluar(id, jumlah);
            manager.simpan();
            break;
        }
        case 5: {
            console.log("--------------");
            manager.tampilkan();
            console.log("--------------");
            const id = rd.questionInt("ID barang yang akan dihapus: ");
            console.log("barang berhasil dihapus");
            manager.hapus(id);
            manager.simpan();
            break;
        }
        case 6: {
            manager.cekStokMenipis();
            console.log("--------------");
            break;
        }
        case 7: {
            console.log("--------------");
            manager.tampilkan();
            console.log("--------------");
            const id = rd.questionInt("ID barang yang akan diubah harganya: ");
            const hargaBaru = rd.questionInt("Masukkan harga baru: ");
            manager.ubahHarga(id, hargaBaru);
            manager.simpan();
            break;
        }
        case 8: {
            console.log("\nTerima kasih telah menggunakan aplikasi manajemen stok barang sederhana ini!");
            process.exit(0);
        }
        default: {
            console.log("Pilihan tidak Valid!");
            break;
        }
    }
}
