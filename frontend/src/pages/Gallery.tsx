/**
 * Gallery page component.
 * Displays a gallery of projects with titles and categories.
 */
const Gallery = () => {
  // Array of project data
  const projects = [
    { id: 1, title: 'Dance Floor Wraps', category: 'Event Decor', imageUrl: 'https://via.placeholder.com/400x250/FFDAB9/8B4513?text=Dance+Floor+Wraps' },
    { id: 2, title: 'Wedding Portrait Prints', category: 'Large-Format Printing', imageUrl: 'https://via.placeholder.com/400x250/E6E6FA/4B0082?text=Wedding+Portraits' },
    { id: 3, title: 'Mirror Decals', category: 'Event Decor', imageUrl: 'https://via.placeholder.com/400x250/ADD8E6/000080?text=Mirror+Decals' },
    { id: 4, title: 'Welcome Signs', category: 'Event Decor', imageUrl: 'https://via.placeholder.com/400x250/F0E68C/8B4513?text=Welcome+Signs' },
    { id: 5, title: 'Wall Graphics & Murals', category: 'Event Decor', imageUrl: 'https://via.placeholder.com/400x250/DDA0DD/800080?text=Wall+Graphics' },
    { id: 6, title: 'Event Backdrops', category: 'Event Decor', imageUrl: 'https://via.placeholder.com/400x250/B0E0E6/4682B4?text=Event+Backdrops' },
    { id: 7, title: 'Corporate Event Decor', category: 'Business Solutions', imageUrl: 'https://via.placeholder.com/400x250/C0C0C0/696969?text=Corporate+Events' },
    { id: 8, title: 'Retail & Restaurant Graphics', category: 'Business Solutions', imageUrl: 'https://via.placeholder.com/400x250/F5DEB3/A0522D?text=Retail+Graphics' },
  ];

  return (
    <div className="section-padding min-h-screen bg-[#FFF2EB]">
      <div className="container-max">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our portfolio of completed event decor and printing projects.
          </p>
        </div>
        
        {/* Grid of gallery projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {/* Placeholder for project image */}
                <span className="text-gray-500">Project Image {project.id}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-primary-600 font-medium">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gallery;