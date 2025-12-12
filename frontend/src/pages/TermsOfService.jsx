import { FileText, CheckCircle, AlertTriangle, Scale, Ban, RefreshCw, Mail } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-lucid-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-lucid-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Términos de Servicio
            </h1>
            <p className="text-dark-400">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            
            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-lucid-400" />
                1. Aceptación de los Términos
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Al acceder y utilizar Lucid Analytics ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al Servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Lucid Analytics es una plataforma de Business Intelligence diseñada para dropshippers que operan con el modelo COD (Cash on Delivery). El Servicio permite:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Conectar cuentas de Meta Ads, Dropi y LucidBot.</li>
                <li>Visualizar métricas consolidadas de rendimiento publicitario.</li>
                <li>Calcular CPA real y ROAS basado en pedidos entregados.</li>
                <li>Analizar datos de cartera y pedidos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                3. Registro y Cuenta
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Para usar el Servicio, debes:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Tener al menos 18 años de edad.</li>
                <li>Proporcionar información precisa y completa durante el registro.</li>
                <li>Contar con un código de invitación válido.</li>
                <li>Mantener la seguridad de tu contraseña y cuenta.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                Eres responsable de todas las actividades que ocurran bajo tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-lucid-400" />
                4. Uso Aceptable
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Te comprometes a utilizar el Servicio de manera ética y legal:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Solo conectarás cuentas de las cuales eres propietario o tienes autorización.</li>
                <li>No intentarás acceder a datos de otros usuarios.</li>
                <li>No usarás el Servicio para actividades ilegales o fraudulentas.</li>
                <li>No intentarás vulnerar la seguridad del sistema.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Ban className="w-5 h-5 text-lucid-400" />
                5. Prohibiciones
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Está estrictamente prohibido:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Compartir tu cuenta o código de invitación sin autorización.</li>
                <li>Realizar ingeniería inversa o intentar extraer el código fuente.</li>
                <li>Usar bots, scrapers o herramientas automatizadas no autorizadas.</li>
                <li>Sobrecargar intencionalmente los servidores del Servicio.</li>
                <li>Revender o redistribuir el acceso al Servicio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                6. Integraciones de Terceros
              </h2>
              <p className="text-dark-300 leading-relaxed">
                El Servicio se integra con plataformas de terceros (Meta, Dropi, LucidBot). Al conectar estas cuentas:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Confirmas que tienes autorización para acceder a esos datos.</li>
                <li>Aceptas los términos de servicio de cada plataforma.</li>
                <li>Entiendes que la disponibilidad de datos depende de esas plataformas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-lucid-400" />
                7. Limitación de Responsabilidad
              </h2>
              <p className="text-dark-300 leading-relaxed">
                El Servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Que el Servicio esté libre de errores o interrupciones.</li>
                <li>La exactitud de los datos obtenidos de plataformas de terceros.</li>
                <li>Resultados específicos de negocio basados en el uso del Servicio.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                En ningún caso seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados del uso del Servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                8. Propiedad Intelectual
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Lucid Analytics, su logo, diseño, código y contenido son propiedad de Trucos Ecomm & Drop. No se concede ninguna licencia o derecho sobre nuestra propiedad intelectual más allá del uso personal del Servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                9. Terminación
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Podemos suspender o terminar tu acceso al Servicio en cualquier momento si:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2 mt-4">
                <li>Violas estos Términos de Servicio.</li>
                <li>Tu uso del Servicio pone en riesgo la plataforma o a otros usuarios.</li>
                <li>Se detecta actividad fraudulenta o sospechosa.</li>
              </ul>
              <p className="text-dark-300 leading-relaxed mt-4">
                También puedes cancelar tu cuenta en cualquier momento contactando a soporte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-lucid-400" />
                10. Modificaciones
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en el Servicio. El uso continuado después de cambios constituye aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">
                11. Ley Aplicable
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa se resolverá en los tribunales competentes de Colombia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-lucid-400" />
                12. Contacto
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Para preguntas sobre estos términos, contáctanos:
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
