import { Shield, Lock, Eye, Trash2, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-lucid-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-lucid-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Política de Privacidad
            </h1>
            <p className="text-dark-400">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            
            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-lucid-400" />
                1. Información que Recopilamos
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Lucid Analytics recopila la siguiente información para proporcionar nuestros servicios:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li><strong className="text-white">Información de cuenta:</strong> Nombre, correo electrónico y contraseña encriptada.</li>
                <li><strong className="text-white">Datos de Meta Ads:</strong> Métricas de campañas publicitarias, gastos y rendimiento de anuncios a través de la API de Meta.</li>
                <li><strong className="text-white">Datos de Dropi:</strong> Información de pedidos, estados de entrega y datos de cartera.</li>
                <li><strong className="text-white">Datos de LucidBot:</strong> Métricas de leads y conversiones de WhatsApp.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-lucid-400" />
                2. Cómo Usamos tu Información
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Utilizamos tu información exclusivamente para:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Calcular métricas de rendimiento como CPA real y ROAS.</li>
                <li>Mostrar dashboards personalizados con tus datos.</li>
                <li>Sincronizar información entre plataformas (Meta, Dropi, LucidBot).</li>
                <li>Mejorar la experiencia del usuario y el servicio.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                <strong className="text-white">No vendemos ni compartimos tu información</strong> con terceros para fines publicitarios o de marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-lucid-400" />
                3. Seguridad de los Datos
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Implementamos medidas de seguridad para proteger tu información:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Todas las contraseñas se almacenan con encriptación bcrypt.</li>
                <li>Los tokens de acceso a APIs se almacenan encriptados con AES-256.</li>
                <li>Todas las comunicaciones usan HTTPS/TLS.</li>
                <li>Acceso restringido a bases de datos con autenticación segura.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-lucid-400" />
                4. Eliminación de Datos
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento. Para hacerlo:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Envía un correo a <a href="mailto:soporte@lucidestrategasia.online" className="text-lucid-400 hover:underline">soporte@lucidestrategasia.online</a></li>
                <li>O contacta a través de nuestro soporte en la aplicación.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                Procesaremos tu solicitud en un máximo de 30 días y eliminaremos permanentemente toda tu información personal y datos conectados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                5. Integraciones con Terceros
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Lucid Analytics se integra con servicios de terceros para proporcionar funcionalidad:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li><strong className="text-white">Meta (Facebook/Instagram):</strong> Accedemos a datos de anuncios con tu autorización explícita a través de OAuth.</li>
                <li><strong className="text-white">Dropi:</strong> Accedemos a datos de pedidos usando credenciales que proporcionas voluntariamente.</li>
                <li><strong className="text-white">LucidBot:</strong> Accedemos a métricas de leads usando tu token de API.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                Puedes revocar el acceso a cualquiera de estas integraciones en cualquier momento desde la sección de Conexiones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                6. Cookies y Almacenamiento Local
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Utilizamos almacenamiento local del navegador (localStorage) únicamente para mantener tu sesión activa. No utilizamos cookies de rastreo ni de terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                7. Cambios a esta Política
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso en la aplicación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-lucid-400" />
                8. Contacto
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Si tienes preguntas sobre esta política de privacidad, contáctanos:
              </p>
              <div className="mt-4 p-4 bg-dark-800/50 rounded-xl">
                <p className="text-white font-medium">Lucid Analytics - Trucos Ecomm & Drop</p>
                <p className="text-dark-400">Email: soporte@lucidestrategasia.online</p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-dark-700 text-center">
            <a href="/" className="text-lucid-400 hover:text-lucid-300 transition-colors">
              ← Volver a Lucid Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
