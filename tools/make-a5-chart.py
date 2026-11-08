import matplotlib.pyplot as plt
import os

OUT_DIR = "/home/zarr/Documents/proyek-msi/bukti/A5"
os.makedirs(OUT_DIR, exist_ok=True)

fig, ax = plt.subplots(figsize=(6, 3.5), dpi=300)
fig.patch.set_facecolor('#ffffff')
ax.set_facecolor('#f8fafc')

categories = ['Sebelum AI', 'Dengan AI']
times = [120, 90]
colors = ['#64748b', '#1f5fae']

bars = ax.bar(categories, times, color=colors, width=0.45, edgecolor='#12305a', linewidth=1.2)

ax.set_ylabel('Waktu Pengerjaan (Menit)', fontsize=10, fontweight='bold', color='#12305a')
ax.set_title('Penurunan Waktu Rekap Internal (Uji 4 Minggu, 20 Staf)', fontsize=11, fontweight='bold', color='#12305a', pad=14)
ax.set_ylim(0, 145)
ax.grid(axis='y', linestyle='--', alpha=0.5, color='#cbd5e1')

for bar, time in zip(bars, times):
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, yval + 4, f"{time} menit", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#12305a')

# Anotasi Penghematan 30 menit / 25%
ax.annotate('Hemat 30 menit (25%)', xy=(1, 90), xytext=(0.5, 110),
            arrowprops=dict(facecolor='#c9a227', shrink=0.08, width=1.5, headwidth=6),
            fontsize=9.5, fontweight='bold', color='#b45309',
            bbox=dict(boxstyle="round,pad=0.3", fc="#fef3c7", ec="#f59e0b", lw=1))

plt.figtext(0.5, 0.01, 'Sumber: Data simulasi tes praktik PT Simulasi Digital Karya (bukan data riil)', ha='center', fontsize=8, color='#64748b', style='italic')

plt.tight_layout()
chart_path = os.path.join(OUT_DIR, "chart_rekap.png")
plt.savefig(chart_path, bbox_inches='tight')
print("Chart generated:", chart_path)

