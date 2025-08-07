import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Smartphone, CreditCard, Shield, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 p-2 rounded-full">
                <div className="text-white font-bold text-xl">🍕</div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                FoodHub
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Giao hàng nhanh chóng, đồ ăn tươi ngon. Đặt món yêu thích chỉ với vài cú click!
            </p>
            <div className="flex items-center space-x-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span className="text-sm text-gray-300 ml-2">4.8/5 từ 10k+ đánh giá</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-400">Liên kết nhanh</h4>
            <div className="space-y-3">
              {[
                'Về chúng tôi',
                'Thực đơn',
                'Khuyến mãi',
                'Đối tác nhà hàng',
                'Trở thành tài xế',
                'Hỗ trợ khách hàng'
              ].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="block text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-400">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-red-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Phố Huế, Hai Bà Trưng, Hà Nội
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-red-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-red-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@foodhub.vn</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={16} className="text-red-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Thứ 2 - CN: 6:00 - 23:00</div>
                  <div className="text-green-400 font-medium">Đang mở cửa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Download App & Payment */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-red-400 mb-4">Tải ứng dụng</h4>
              <div className="space-y-3">
                <button className="w-full bg-black hover:bg-gray-800 rounded-lg p-3 transition-colors duration-200 flex items-center space-x-3">
                  <div className="bg-white p-1 rounded">
                    <Smartphone size={16} className="text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Tải về từ</div>
                    <div className="font-semibold text-sm">App Store</div>
                  </div>
                </button>
                <button className="w-full bg-black hover:bg-gray-800 rounded-lg p-3 transition-colors duration-200 flex items-center space-x-3">
                  <div className="bg-white p-1 rounded">
                    <Smartphone size={16} className="text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Tải về từ</div>
                    <div className="font-semibold text-sm">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-red-400 mb-4">Thanh toán</h4>
              <div className="grid grid-cols-3 gap-2">
                {['VISA', 'MASTER', 'MOMO'].map((payment, index) => (
                  <div key={index} className="bg-white rounded-lg p-2 flex items-center justify-center">
                    <span className="text-gray-800 text-xs font-bold">{payment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
              <div className="bg-red-600 p-2 rounded-full">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-sm">Giao hàng nhanh</h5>
                <p className="text-gray-400 text-xs">Trung bình 30 phút</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
              <div className="bg-green-600 p-2 rounded-full">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-sm">An toàn & Bảo mật</h5>
                <p className="text-gray-400 text-xs">Thanh toán được mã hóa</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
              <div className="bg-blue-600 p-2 rounded-full">
                <CreditCard size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-sm">Đa dạng thanh toán</h5>
                <p className="text-gray-400 text-xs">Thẻ, ví điện tử, COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="bg-black/50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 FoodHub. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Theo dõi chúng tôi:</span>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: 'hover:text-blue-500' },
                  { icon: Instagram, color: 'hover:text-pink-500' },
                  { icon: Twitter, color: 'hover:text-blue-400' },
                  { icon: Youtube, color: 'hover:text-red-500' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`text-gray-400 ${social.color} transition-colors duration-200 hover:scale-110 transform`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;