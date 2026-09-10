/**
 * Kranti Furnitures & Electronics - Product Catalog Database
 * High-fidelity product data matching Stitch designs and specifications
 */

const PRODUCTS_DATA = [
  {
    id: "loring-3-seater-sofa",
    name: "Loring 3-Seater Velvet Sofa",
    category: "sofas",
    categoryLabel: "Sofas & Recliners",
    subCategory: "Sofas",
    brand: "Urban Living",
    price: 34999,
    originalPrice: 41175,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 128,
    badge: "15% OFF",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6AlQf8l0htq7cHBA8cW81kJJF-m-KUrHjqpXKQUFP3psDxxY3g4twEj8Ul82vGhvQSinKi1Sbr7cJ3g_9X5XnXFt3y-n14MzBqmo_t5C-LyADX8CPcg0r8vsHl5CJO07N794n_GZGujnD1VM6anBOIDA5uWui0bzoQVZ9TuppoeU_g8-ESKl4jAR5LI7pOamEYgPFj08rr3Wwt_wygmpfTlfpOgz3ep8XKXCAA8nvYn8twLWu8A-C",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSkAIDRNZVKdpnifYFTJ6BwbG0BuFjwIA1MBjS_MwrYUfE_NQ4nFFNpcXWLFgTef_b4RlQ4Smxc9QbSeGBg0SDIw4ClpoVCaTBsVouWgo_iq9_a9E9s42R6G5TtYSoTpZOEx0kpNbdXnjrnGVp2m9hWf0wFRs3lNNgqCczt7-6D0-LlnulW2biwE56PcLvyOxLH8DLDryx3AxhFLhqzUEFFcFN_r5Qeh2261Alnfnmdn-cYYj1ErOv"
    ],
    description: "Crafted with premium high-density velvet fabric and solid sheesham wood frame. Features ergonomic dual-cushioning for unmatched lounge comfort and an elegant modern silhouette that elevates any living room.",
    variants: {
      sizes: ["3-Seater (84\" W)", "2-Seater (62\" W)", "Sectional L-Shape"],
      colors: [
        { name: "Deep Navy Velvet", hex: "#002045" },
        { name: "Stone Grey", hex: "#78716c" },
        { name: "Warm Amber", hex: "#c6955e" }
      ]
    },
    specs: {
      "Primary Material": "High-Density Velvet & Kiln-Dried Solid Hardwood",
      "Filling Material": "32-Density Super Soft PU Foam + Pocket Springs",
      "Seating Capacity": "3 Persons",
      "Dimensions (Inches)": "34 H x 84 W x 36 D",
      "Seating Height": "18.5 Inches",
      "Warranty": "5-Year Manufacturer Warranty on Frame"
    }
  },
  {
    id: "samsung-65-qled-4k-tv",
    name: "Samsung 65\" Class QLED 4K Q60C Series Smart TV",
    category: "electronics",
    categoryLabel: "Televisions",
    subCategory: "Televisions",
    brand: "Samsung",
    price: 84990,
    originalPrice: 114900,
    discountPercent: 26,
    rating: 4.6,
    reviewsCount: 1284,
    badge: "Best Seller",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZesYvQZKFG-3HUzGm4ui3VRJYGdDvtg5FcHTvhK4El1kGNCijRqYqlcrlEL9NzU5Nw982LbLERIhJCw9QytRsqYAEQiEL3EAj9PIR9qxxT-Xz1igO6nU5Ydqv-5NczcgJwRpP-lloJ5P_NhCNL9p1j8Rz0Q8SDT9T1fcdOrOwvma_uskucqN_GupKouBOulfJKl2PV6o18hUrllg04l97DgpZv1gS_cQQ6alwCMXbuAspamGKJXu7",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZesYvQZKFG-3HUzGm4ui3VRJYGdDvtg5FcHTvhK4El1kGNCijRqYqlcrlEL9NzU5Nw982LbLERIhJCw9QytRsqYAEQiEL3EAj9PIR9qxxT-Xz1igO6nU5Ydqv-5NczcgJwRpP-lloJ5P_NhCNL9p1j8Rz0Q8SDT9T1fcdOrOwvma_uskucqN_GupKouBOulfJKl2PV6o18hUrllg04l97DgpZv1gS_cQQ6alwCMXbuAspamGKJXu7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHubKN70dN9tBq9b05i335im7ksiMKHHaqrLMGTHFTermQCnGkYGYfjbXXqL6uhSj-Ne8O9Bh4qH4Ux54wXNF2LpqL5aLVLuV081D7vGLIZcCPbiLoGCORN241S7eOaEZft-01OtleW4Vo8KHVaSS9y1R36_Og4hPYlCjNonoFkmWsdODOFgICiEbSKMmgicRp3NNNbB8CmIfsgEb1Wmhxg-z8_8LBtft2CAKXen15gzO3UhDpx3ya",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASPRrbjHMOwJdw4Mu1D-vdxp01hFEEafhLZ020njZF46Ae2uqVQk7ABONs0A6g5Gu-JIVQHnEYD5fBi1_ae2YCMQFtpcNjak-0P57L5I2yc61Tdj66_Eu8KkOhgUMiSb1WMfk-H3c7B_WsRCaw7xGWmEL9IYtbap5f_rt1At6jBq-DvTFk2EnQlc60OqWJyuzf3uSUdi_ZPlK2W2oMVP94bgJLNDqRqwUQ7nn_2LGBrKk4mS0RzQdj",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzAtDk3hvUkCJ5_G2zD1AdbSdhu9Zk5VOmnd-8BazwdqEVvpZzjWklpjQMqou9_Fuype39L_wau6kQ0qKZ0SdjGcxnnRT4Tc9BBHYvCSl6iBA2zQK3w8kca6iSa70Pd6NdGptmKkvQLO9XEljmBqC4TWJNScF7pDUnCLxSQRcrQtUyMlAqKkQbqaP7Urc8JYOS-T793nO6--3QPqeod4IVi_9KDTKRqwO3YuhIUWohHp6ZYF7wdhWA"
    ],
    description: "Experience Quantum Dot technology with 100% Color Volume. Dual LED backlighting provides balanced contrast. Ultra-slim AirSlim design blends seamlessly into any modern room. Includes SolarCell Smart Remote with built-in voice assistants.",
    variants: {
      sizes: ["55 Inch", "65 Inch", "75 Inch"],
      colors: [
        { name: "Titan Gray Metallic", hex: "#374151" },
        { name: "Obsidian Black", hex: "#111827" }
      ]
    },
    specs: {
      "Display Resolution": "4K Ultra HD (3840 x 2160)",
      "Refresh Rate": "60 Hz (Quantum Processor Lite 4K)",
      "HDR Standard": "Quantum HDR, HDR10+ Adaptive, HLG",
      "Audio Output": "20W 2.0Ch with OTS Lite & Q-Symphony",
      "Connectivity": "3 HDMI, 2 USB, Bluetooth 5.2, Wi-Fi 5, Optical",
      "Smart Platform": "Tizen OS with Netflix, Prime, Hotstar, YouTube",
      "Warranty": "1-Year Comprehensive + 1-Year Additional on Panel"
    }
  },
  {
    id: "sony-bravia-65-oled-tv",
    name: "Sony Bravia 65\" 4K Ultra HD Smart OLED TV",
    category: "electronics",
    categoryLabel: "Televisions",
    subCategory: "Televisions",
    brand: "Sony",
    price: 145990,
    originalPrice: 189900,
    discountPercent: 23,
    rating: 4.9,
    reviewsCount: 842,
    badge: "Premium Flagship",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAviOs9QAvWnOOWiA59hBZuVZS0wqzHhyahnP31f0Le_tglvUpxk7YuGT044yST8aZqEdr5KcCYywuhof3N3uteUVjbHixhKV5czHS5-tf5jE9PhxcXhp5jZHFugI_3dRWjtu1E3Zc54z5jWl5mCc-NJgk_NdNy0E24ScP7C68vfNL7CEaOZTZIHhDbX2ApsEGMo3T5L9EXVv1d3DXiyMFyRU_jrXgpIEUGzPodPoSDi-jfVGvPtIo3"
    ],
    description: "Cognitive Processor XR delivers deep OLED blacks and purest highlights. Acoustic Surface Audio+ turns the screen itself into a multi-channel speaker with theater-grade clarity.",
    variants: {
      sizes: ["55 Inch", "65 Inch"],
      colors: [{ name: "Titanium Metal Edge", hex: "#1e293b" }]
    },
    specs: {
      "Display Technology": "Self-illuminating OLED",
      "Processor": "Cognitive Processor XR",
      "Sound": "50W Acoustic Surface Audio+ with Subwoofers",
      "Gaming Features": "HDMI 2.1 4K 120Hz, VRR, ALLM",
      "Operating System": "Google TV with Hands-Free Voice Search",
      "Warranty": "2-Year Manufacturer Warranty"
    }
  },
  {
    id: "urban-comfort-2-seater-sofa",
    name: "Urban Comfort 2-Seater Fabric Sofa",
    category: "sofas",
    categoryLabel: "Sofas & Recliners",
    subCategory: "Sofas",
    brand: "ComfortPlus",
    price: 18500,
    originalPrice: 24000,
    discountPercent: 22,
    rating: 4.5,
    reviewsCount: 76,
    badge: "22% OFF",
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSkAIDRNZVKdpnifYFTJ6BwbG0BuFjwIA1MBjS_MwrYUfE_NQ4nFFNpcXWLFgTef_b4RlQ4Smxc9QbSeGBg0SDIw4ClpoVCaTBsVouWgo_iq9_a9E9s42R6G5TtYSoTpZOEx0kpNbdXnjrnGVp2m9hWf0wFRs3lNNgqCczt7-6D0-LlnulW2biwE56PcLvyOxLH8DLDryx3AxhFLhqzUEFFcFN_r5Qeh2261Alnfnmdn-cYYj1ErOv",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSkAIDRNZVKdpnifYFTJ6BwbG0BuFjwIA1MBjS_MwrYUfE_NQ4nFFNpcXWLFgTef_b4RlQ4Smxc9QbSeGBg0SDIw4ClpoVCaTBsVouWgo_iq9_a9E9s42R6G5TtYSoTpZOEx0kpNbdXnjrnGVp2m9hWf0wFRs3lNNgqCczt7-6D0-LlnulW2biwE56PcLvyOxLH8DLDryx3AxhFLhqzUEFFcFN_r5Qeh2261Alnfnmdn-cYYj1ErOv"
    ],
    description: "Compact, cozy, and ultra-durable loveseat upholstered in breathable textured woven fabric. Perfect for modern apartments, study rooms, or lounge spaces.",
    variants: {
      sizes: ["2-Seater (58\" W)"],
      colors: [
        { name: "Stone Grey", hex: "#71717a" },
        { name: "Oatmeal Beige", hex: "#e2d9cc" }
      ]
    },
    specs: {
      "Upholstery": "High-Grade Breathable Polyester Blend",
      "Frame Material": "Solid Salwood",
      "Dimensions": "32 H x 58 W x 33 D Inches",
      "Warranty": "3-Year Structure Warranty"
    }
  },
  {
    id: "ergonomic-wooden-dining-chair",
    name: "Ergonomic Solid Teakwood Dining Chair",
    category: "dining",
    categoryLabel: "Dining",
    subCategory: "Chairs",
    brand: "Luxe Home",
    price: 5499,
    originalPrice: 7500,
    discountPercent: 26,
    rating: 4.7,
    reviewsCount: 94,
    badge: "Handcrafted",
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1aEyX5Lva29nYe3IjyXiajdh3LvN3KsRuDRE5ZTcEV2tNO76QktZat0r7RUSuHp9frwIJZKfRsUHRMdS_QpFNVoOMco33gcK8kKYoJjU3BZfU5aJrpNst8DzQw4bxDkF40GzTiY3rHQTZKLiu4f85qM3Zwp8l7XKejetWgbEelo5AtHW173-vbzeFJQK_qKuDWvczKYDFEF-KE68lcGU139b5FbBZjggiNuN76_YWPcpBXrvt7PB",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1aEyX5Lva29nYe3IjyXiajdh3LvN3KsRuDRE5ZTcEV2tNO76QktZat0r7RUSuHp9frwIJZKfRsUHRMdS_QpFNVoOMco33gcK8kKYoJjU3BZfU5aJrpNst8DzQw4bxDkF40GzTiY3rHQTZKLiu4f85qM3Zwp8l7XKejetWgbEelo5AtHW173-vbzeFJQK_qKuDWvczKYDFEF-KE68lcGU139b5FbBZjggiNuN76_YWPcpBXrvt7PB",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD"
    ],
    description: "Expertly contoured solid teakwood backrest with cushioned seat base in stain-resistant fabric. Combines traditional Indian woodworking with clean Scandinavian aesthetics.",
    variants: {
      sizes: ["Standard Dining Chair"],
      colors: [
        { name: "Natural Honey Teak", hex: "#9a3412" },
        { name: "Walnut Dark Brown", hex: "#451a03" }
      ]
    },
    specs: {
      "Wood Species": "100% Seasoned Indian Teakwood",
      "Seat Cushion": "High Resilience Foam with Linen Upholstery",
      "Dimensions": "36 H x 18 W x 20 D Inches",
      "Weight Capacity": "140 kg",
      "Warranty": "5-Year Termite & Wood Resistance Guarantee"
    }
  },
  {
    id: "smart-4k-led-55-tv",
    name: "55\" 4K Ultra HD Smart LED TV with Dolby Vision",
    category: "electronics",
    categoryLabel: "Televisions",
    subCategory: "Televisions",
    brand: "Urban Living",
    price: 34999,
    originalPrice: 49999,
    discountPercent: 30,
    rating: 4.4,
    reviewsCount: 312,
    badge: "30% OFF",
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAviOs9QAvWnOOWiA59hBZuVZS0wqzHhyahnP31f0Le_tglvUpxk7YuGT044yST8aZqEdr5KcCYywuhof3N3uteUVjbHixhKV5czHS5-tf5jE9PhxcXhp5jZHFugI_3dRWjtu1E3Zc54z5jWl5mCc-NJgk_NdNy0E24ScP7C68vfNL7CEaOZTZIHhDbX2ApsEGMo3T5L9EXVv1d3DXiyMFyRU_jrXgpIEUGzPodPoSDi-jfVGvPtIo3",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAviOs9QAvWnOOWiA59hBZuVZS0wqzHhyahnP31f0Le_tglvUpxk7YuGT044yST8aZqEdr5KcCYywuhof3N3uteUVjbHixhKV5czHS5-tf5jE9PhxcXhp5jZHFugI_3dRWjtu1E3Zc54z5jWl5mCc-NJgk_NdNy0E24ScP7C68vfNL7CEaOZTZIHhDbX2ApsEGMo3T5L9EXVv1d3DXiyMFyRU_jrXgpIEUGzPodPoSDi-jfVGvPtIo3"
    ],
    description: "Bezel-less 4K Smart TV featuring HDR10+, Dolby Audio 24W box speakers, Dual-Band Wi-Fi, and Google Assistant remote.",
    variants: {
      sizes: ["43 Inch", "55 Inch"],
      colors: [{ name: "Midnight Matte Black", hex: "#0f172a" }]
    },
    specs: {
      "Resolution": "3840 x 2160 Pixels (A+ Grade IPS Panel)",
      "Audio": "24W Stereo with Dolby Audio",
      "RAM & Storage": "2GB RAM + 16GB Internal Storage",
      "Ports": "3 HDMI (1 eARC), 2 USB 2.0",
      "Warranty": "1-Year Comprehensive Warranty"
    }
  },
  {
    id: "royal-plush-recliner-armchair",
    name: "Royal Plush Motorized Leatherette Recliner",
    category: "recliners",
    categoryLabel: "Sofas & Recliners",
    subCategory: "Recliners",
    brand: "ComfortPlus",
    price: 24500,
    originalPrice: 32000,
    discountPercent: 23,
    rating: 4.8,
    reviewsCount: 165,
    badge: "Top Rated",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFTiNu-briRs9EiZMk2uFGDvQJ63_odxZVa942oJ1Nj00iBw0U5A9K9ms3wmOa8sBgMu01e-9oit_JN9T5rD_11fVNQACXA5Jo0o0940Tbe5eIalxCotXB-an_2_cyogAuL08YqnU40PriLRe5gcY5TubqaTwhzcmb2HxnxeRE_Wa_rm2c9-CLyaoGUCWLbkTtglXopoucybAqMUCxO-yVvFLZKNYyb5lpnGxNZRw1IQgXWAeWr33P",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFTiNu-briRs9EiZMk2uFGDvQJ63_odxZVa942oJ1Nj00iBw0U5A9K9ms3wmOa8sBgMu01e-9oit_JN9T5rD_11fVNQACXA5Jo0o0940Tbe5eIalxCotXB-an_2_cyogAuL08YqnU40PriLRe5gcY5TubqaTwhzcmb2HxnxeRE_Wa_rm2c9-CLyaoGUCWLbkTtglXopoucybAqMUCxO-yVvFLZKNYyb5lpnGxNZRw1IQgXWAeWr33P"
    ],
    description: "One-touch motorized power reclining with integrated USB fast-charging port, deep cup holders, and high-resilience ergonomic lumbar support.",
    variants: {
      sizes: ["1-Seater Single Recliner"],
      colors: [
        { name: "Espresso Brown", hex: "#382216" },
        { name: "Cream Ivory", hex: "#f5f5f4" }
      ]
    },
    specs: {
      "Reclining Mechanism": "Heavy Duty German Motorized Mechanism (160° Recline)",
      "Cover Material": "Premium Breathable Anti-Peel Leatherette",
      "Weight Capacity": "160 kg",
      "Warranty": "3-Year Warranty on Mechanism & Motor"
    }
  },
  {
    id: "luxury-sheesham-king-bed",
    name: "Heritage Solid Sheesham Wood King Bed with Storage",
    category: "beds",
    categoryLabel: "Beds",
    subCategory: "Beds",
    brand: "Luxe Home",
    price: 42999,
    originalPrice: 58000,
    discountPercent: 25,
    rating: 4.9,
    reviewsCount: 204,
    badge: "Solid Wood",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-RVXoMka_gdeatFXDqL4kISTTI4-OgJdNSHsHFUv_qwix3DsK3vn8OfDki2fS3VQF-f8umW0lIpg02Z0Ntfob5w8xF7s7dyJ6WeomlzbiNovoBTLYGtkMw9E2-h1HHO1TyQqPFv1ZaD-XH0TyuhR8wbYXxrU3wvmJ1BXB1Blm7g0CAT_zc6msGxvU_hAksPN-Mr88hHm8UHPsgeeHWCE1ulfGuWDmCYoSzxNZiDErPQvFwNhCooR6",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-RVXoMka_gdeatFXDqL4kISTTI4-OgJdNSHsHFUv_qwix3DsK3vn8OfDki2fS3VQF-f8umW0lIpg02Z0Ntfob5w8xF7s7dyJ6WeomlzbiNovoBTLYGtkMw9E2-h1HHO1TyQqPFv1ZaD-XH0TyuhR8wbYXxrU3wvmJ1BXB1Blm7g0CAT_zc6msGxvU_hAksPN-Mr88hHm8UHPsgeeHWCE1ulfGuWDmCYoSzxNZiDErPQvFwNhCooR6"
    ],
    description: "Grand master bedroom king bed handcrafted from 100% solid Sheesham wood with hydraulic lift-on storage compartments and cushioned tufted headboard.",
    variants: {
      sizes: ["King Size (78\" x 72\")", "Queen Size (78\" x 60\")"],
      colors: [
        { name: "Rich Honey Finish", hex: "#78350f" },
        { name: "Teak Brown", hex: "#451a03" }
      ]
    },
    specs: {
      "Wood": "100% Seasoned Sheesham Wood (Rosewood)",
      "Storage": "Hydraulic Easy-Lift Storage System (1200L Capacity)",
      "Headboard": "Padded Velvet Tufted Backing",
      "Warranty": "10-Year Termite & Structural Warranty"
    }
  },
  {
    id: "frost-free-double-door-fridge",
    name: "Frost-Free Double Door Smart Inverter Refrigerator (340L)",
    category: "appliances",
    categoryLabel: "Refrigerators",
    subCategory: "Refrigerators",
    brand: "Samsung",
    price: 32490,
    originalPrice: 42990,
    discountPercent: 24,
    rating: 4.7,
    reviewsCount: 450,
    badge: "5-Star Inverter",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqPz6V7kHCK7ODMtEnSxAupw6UhEPl__M4LX6UnArR0Lt81-Km3ABNWoa8QnB0obFF3UOlKGY7U-0Osz1OF8z18PRu8EY0m1N-vkpxIpaGG2AhXXDj1gLPE9pSKbLYcTBfbox-F1e9ZyFNLIEemvQGcAvZhYiyNteRG8HXHEewbD6e_z0GVbQUug3Drm9biB9AxY-9-7oH_ivnbKzsyEb9TyVpgchxGkFmNNpXs4zbf84MrEZTlhyg",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqPz6V7kHCK7ODMtEnSxAupw6UhEPl__M4LX6UnArR0Lt81-Km3ABNWoa8QnB0obFF3UOlKGY7U-0Osz1OF8z18PRu8EY0m1N-vkpxIpaGG2AhXXDj1gLPE9pSKbLYcTBfbox-F1e9ZyFNLIEemvQGcAvZhYiyNteRG8HXHEewbD6e_z0GVbQUug3Drm9biB9AxY-9-7oH_ivnbKzsyEb9TyVpgchxGkFmNNpXs4zbf84MrEZTlhyg"
    ],
    description: "Digital Inverter Technology for 50% energy savings and ultra-quiet operation. Features convertible 5-in-1 modes, Twin Cooling Plus, and deodorizing filter.",
    variants: {
      sizes: ["340 Liters", "420 Liters"],
      colors: [
        { name: "Refined Inox Stainless Steel", hex: "#94a3b8" },
        { name: "Black Mirror Glass", hex: "#18181b" }
      ]
    },
    specs: {
      "Capacity": "340 Liters (Fresh Food 252L, Freezer 88L)",
      "Energy Rating": "5 Star BEE Rating",
      "Compressor": "Digital Inverter with 20-Year Warranty",
      "Warranty": "1-Year Comprehensive + 20-Year on Compressor"
    }
  },
  {
    id: "modern-teakwood-dining-set",
    name: "Modern Teakwood 6-Seater Dining Table Set",
    category: "dining",
    categoryLabel: "Dining",
    subCategory: "Dining Sets",
    brand: "Luxe Home",
    price: 48999,
    originalPrice: 65000,
    discountPercent: 24,
    rating: 4.8,
    reviewsCount: 118,
    badge: "Complete Set",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD"
    ],
    description: "Contemporary 6-seater dining table with tempered bevel-edge top and six solid cushioned teakwood chairs. Built for family feasts with easy-to-clean durability.",
    variants: {
      sizes: ["6-Seater Table (60\" x 36\")", "8-Seater Table (84\" x 42\")"],
      colors: [{ name: "Warm Honey Teak", hex: "#b45309" }]
    },
    specs: {
      "Set Includes": "1 Dining Table + 6 Ergonomic Dining Chairs",
      "Wood Material": "100% Grade-A Kiln-Dried Teakwood",
      "Table Dimensions": "30 H x 60 L x 36 W Inches",
      "Warranty": "5-Year Manufacturer Warranty"
    }
  }
];

// Helper functions for currency formatting & search
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function getProductById(id) {
  return PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
}

function getProductsByCategory(category) {
  if (!category || category === 'all') return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(p => p.category === category || p.subCategory.toLowerCase() === category.toLowerCase());
}
